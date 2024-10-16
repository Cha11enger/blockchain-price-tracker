import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { PriceModule } from './modules/price/price.module';
import { Price } from './modules/price/price.entity';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule'; // Add ScheduleModule for Cron jobs
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Make sure this is initialized
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: parseInt(configService.get('DATABASE_PORT'), 10),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    PriceModule,
    TypeOrmModule.forFeature([Price]),
    HttpModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
