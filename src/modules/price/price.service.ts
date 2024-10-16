import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan } from 'typeorm';
import { Price } from './price.entity';
import { Alert } from './alert.entity';  // Import the alert entity
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { NotificationsService } from '../notifications/notifications.service';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc); // Extend dayjs with UTC plugin

@Injectable()
export class PriceService implements OnModuleInit {
  private readonly logger = new Logger(PriceService.name);  // Set up the logger

  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>, // Inject the alert repository
    private httpService: HttpService,
    private notificationsService: NotificationsService, // Inject NotificationsService
  ) {}

  // Method that runs when the application starts
  async onModuleInit() {
    this.logger.log('Application started, fetching and saving initial prices...');
    await this.fetchAndSavePrices();
  }

  // Method to log prices and percentage change every 5 seconds
// //   @Cron(CronExpression.EVERY_5_SECONDS)
  @Cron(CronExpression.EVERY_2_HOURS)
  async logPrices() {
    this.logger.log('Executing logPrices task...'); // Log when the cron job starts
    const ethereumPrice = await this.fetchPriceFromAPI('ethereum');
    const polygonPrice = await this.fetchPriceFromAPI('polygon');

    this.logger.log(`Logged Ethereum price: $${ethereumPrice}`);
    this.logger.log(`Logged Polygon price: $${polygonPrice}`);

    // Log percentage change for every 5 seconds
    await this.checkPriceChange('ethereum', ethereumPrice);
    await this.checkPriceChange('polygon', polygonPrice);
  }

  // Method to fetch and save prices every 5 minutes
  @Cron(CronExpression.EVERY_5_MINUTES)
  async fetchAndSavePrices() {
    this.logger.log('Executing fetchAndSavePrices task...'); // Log when the cron job starts
    this.logger.log('Starting price fetching for Ethereum and Polygon...');

    const ethereumPrice = await this.fetchPriceFromAPI('ethereum');
    const polygonPrice = await this.fetchPriceFromAPI('polygon');

    this.logger.log(`Fetched Ethereum price: $${ethereumPrice}`);
    this.logger.log(`Fetched Polygon price: $${polygonPrice}`);

    await this.savePrice('ethereum', ethereumPrice);
    await this.savePrice('polygon', polygonPrice);

    // Check if any price alert has been hit
    await this.checkPriceAlert('ethereum', ethereumPrice);
    await this.checkPriceAlert('polygon', polygonPrice);

    // After saving prices, check if the price has increased by more than 3%
    await this.checkPriceChange('ethereum', ethereumPrice);
    await this.checkPriceChange('polygon', polygonPrice);
  }

  // Swap rate calculation between eth/polygon to BTC
  async getSwapRate(chain: string, amount: number): Promise<any> {
    const btcPrice = await this.getBitcoinPrice(); // Get BTC price
    let chainPrice: number;

    if (chain === 'ethereum') {
      chainPrice = await this.fetchPriceFromAPI('ethereum'); // Get Ethereum price
    } else if (chain === 'polygon') {
      chainPrice = await this.fetchPriceFromAPI('polygon'); // Get Polygon price
    } else {
      throw new Error('Unsupported chain');
    }

    const equivalentBTC = (amount * chainPrice) / btcPrice; // Calculate equivalent BTC
    const fee = amount * 0.03; // Fee calculation (3%)
    const feeInDollar = fee * chainPrice; // Fee in USD

    return {
      equivalentBTC,
      fee: { inChain: fee, inDollar: feeInDollar },
    };
  }

  // Get current Bitcoin price
  async getBitcoinPrice(): Promise<number> {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
    
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const btcPrice = response.data.bitcoin.usd;
      return btcPrice;
    } catch (error) {
      this.logger.error(`Error fetching Bitcoin price:`, error.message);
      throw new Error('Failed to fetch Bitcoin price');
    }
  }

  // Method to get hourly prices within the last 24 hours
  async getHourlyPrices(chain: string) {
    const now = dayjs().utc();
    const oneDayAgo = now.subtract(24, 'hours').toDate();

    // Get all prices for the chain within the last 24 hours
    const prices = await this.priceRepository.find({
      where: { chain, createdAt: Between(oneDayAgo, new Date()) },
      order: { createdAt: 'ASC' },
    });

    // Group prices by hour
    const hourlyPrices = [];
    for (let hourOffset = 0; hourOffset < 24; hourOffset++) {
      const hourStart = now.subtract(hourOffset, 'hour').startOf('hour').toDate();
      const hourEnd = now.subtract(hourOffset, 'hour').endOf('hour').toDate();

      const pricesInHour = prices.filter(price =>
        price.createdAt >= hourStart && price.createdAt <= hourEnd,
      );

      // Get the last price in the hour, or null if no price is found
      const lastPriceInHour = pricesInHour.length > 0 ? pricesInHour[pricesInHour.length - 1].price : null;
      hourlyPrices.push({
        hour: hourStart,
        price: lastPriceInHour,
      });
    }

    return hourlyPrices.reverse(); // Reverse to get chronological order
  }

  // Method to set a price alert
  async setPriceAlert(chain: string, targetPrice: number, email: string): Promise<string> {
    const alert = this.alertRepository.create({
      chain,
      targetPrice,
      email,
    });

    await this.alertRepository.save(alert);
    this.logger.log(`Price alert set for ${chain} at $${targetPrice} for ${email}`);
    return `Price alert for ${chain} at $${targetPrice} has been set for ${email}`;
  }

  // Check price alert if it matches the user-set price
  async checkPriceAlert(chain: string, currentPrice: number) {
    const alerts = await this.alertRepository.find({ where: { chain } });

    for (const alert of alerts) {
      if (currentPrice >= alert.targetPrice) {
        const message = `The price of ${chain} has reached your target of $${alert.targetPrice}. Current price: $${currentPrice}.`;
        await this.notificationsService.sendEmail(alert.email, `${chain} Price Alert`, message);
        this.logger.log(`Alert triggered for ${alert.email} on ${chain} at $${currentPrice}`);
      }
    }
  }

  // Log percentage change based on the price from 1 hour ago and send email if price increased by more than 3%
  async checkPriceChange(chain: string, currentPrice: number) {
    // Get the price from 1 hour ago
    const oneHourAgo = dayjs().subtract(1, 'hour').toDate();
    const priceOneHourAgo = await this.priceRepository.findOne({
      where: {
        chain,
        createdAt: LessThan(oneHourAgo),
      },
      order: { createdAt: 'DESC' },
    });

    if (!priceOneHourAgo) {
      this.logger.log(`No price record found for ${chain} from 1 hour ago.`);
      return;
    }

    // Calculate the percentage change
    const priceChange = ((currentPrice - priceOneHourAgo.price) / priceOneHourAgo.price) * 100;
    this.logger.log(`${chain} price change in the last hour: ${priceChange}%`);

    // If the price increased by more than 3%, send an email
    if (priceChange > 3) {
      const message = `The price of ${chain} has increased by more than 3% in the last hour. Current price: $${currentPrice}.`;
      this.logger.log(message);
      await this.notificationsService.sendEmail('hyperhire_assignment@hyperhire.in', `${chain} Price Alert`, message);
    }
  }

  // Fetch price from Moralis API
  async fetchPriceFromAPI(chain: string): Promise<number> {
    const url = this.getMoralisApiUrl(chain);
    const apiKey = process.env.MORALIS_API_KEY;
    
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: { 'X-API-Key': apiKey },
        }),
      );

      const price = response.data.usdPrice;
      return price;
    } catch (error) {
      this.logger.error(`Error fetching price for ${chain}:`, error.message);
      throw new Error('Failed to fetch price');
    }
  }

  // Get the correct API URL based on the chain
  getMoralisApiUrl(chain: string): string {
    switch (chain) {
      case 'ethereum':
        return 'https://deep-index.moralis.io/api/v2.2/erc20/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/price';
      case 'polygon':
        return 'https://deep-index.moralis.io/api/v2.2/erc20/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0/price';
      default:
        throw new Error(`Unsupported chain: ${chain}`);
    }
  }

  // Save the price in the database
  async savePrice(chain: string, price: number): Promise<void> {
    const priceEntity = this.priceRepository.create({ chain, price });
    await this.priceRepository.save(priceEntity);
    this.logger.log(`Price for ${chain} saved successfully: $${price}`);
  }
}
