// import { Controller, Get, Param, Post, Body } from '@nestjs/common';
// import { PriceService } from './price.service';

// @Controller('price')
// export class PriceController {
//   constructor(private readonly priceService: PriceService) {}

//   // API to get the latest prices for Ethereum and Polygon
//   @Get('latest')
//   async getLatestPrices() {
//     const ethereumPrice = await this.priceService.fetchPriceFromAPI('ethereum');
//     const polygonPrice = await this.priceService.fetchPriceFromAPI('polygon');
//     return {
//       ethereum: ethereumPrice,
//       polygon: polygonPrice,
//     };
//   }

//   // API to get prices of each hour within 24 hours for a specific chain
//   @Get('hourly/:chain')
//   async getHourlyPrices(@Param('chain') chain: string) {
//     return this.priceService.getHourlyPrices(chain);
//   }

//   // API to set a price alert for a specific chain and target price
//   @Post('set-alert')
//   async setPriceAlert(
//     @Body('chain') chain: string,
//     @Body('targetPrice') targetPrice: number,
//     @Body('email') email: string,
//   ) {
//     return this.priceService.setPriceAlert(chain, targetPrice, email);
//   }

//   // API to get swap rate between eth/polygon to BTC
//   @Post('swap-rate')
//   async getSwapRate(
//     @Body('chain') chain: string,
//     @Body('amount') amount: number,
//   ) {
//     return this.priceService.getSwapRate(chain, amount);
//   }
// }


import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PriceService } from './price.service';
import { SetAlertDto } from './dto/set-alert.dto';
import { SwapRateDto } from './dto/swap-rate.dto';
import { SwapRateResponseDto } from './dto/swap-rate-response.dto';

@ApiTags('Price')
@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get('latest')
  @ApiOperation({ summary: 'Get the latest prices for Ethereum and Polygon' })
  @ApiResponse({ status: 200, description: 'Latest ETH and MATIC prices' })
  async getLatestPrices() {
    const ethereumPrice = await this.priceService.fetchPriceFromAPI('ethereum');
    const polygonPrice = await this.priceService.fetchPriceFromAPI('polygon');
    return {
      ethereum: ethereumPrice,
      polygon: polygonPrice,
    };
  }

  @Get('hourly/:chain')
  @ApiOperation({ summary: 'Get hourly prices for the last 24 hours' })
  @ApiResponse({ status: 200, description: 'Hourly prices for a specific chain' })
  async getHourlyPrices(@Param('chain') chain: string) {
    return this.priceService.getHourlyPrices(chain);
  }

  @Post('set-alert')
  @ApiOperation({ summary: 'Set a price alert for a specific chain' })
  @ApiBody({ type: SetAlertDto })
  @ApiResponse({ status: 201, description: 'Alert has been set' })
  async setPriceAlert(@Body() setAlertDto: SetAlertDto) {
    return this.priceService.setPriceAlert(setAlertDto.chain, setAlertDto.targetPrice, setAlertDto.email);
  }

  @Post('swap-rate')
  @ApiOperation({ summary: 'Get swap rate between ETH/MATIC and BTC' })
  @ApiBody({ type: SwapRateDto })
  @ApiResponse({ status: 200, description: 'Swap rate calculated', type: SwapRateResponseDto })
  async getSwapRate(@Body() swapRateDto: SwapRateDto) {
    return this.priceService.getSwapRate(swapRateDto.chain, swapRateDto.amount);
  }
}
