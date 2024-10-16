import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from './price.entity';
import { Alert } from './alert.entity';  // Import the Alert entity
import { PriceService } from './price.service';
import { HttpModule } from '@nestjs/axios';
import { PriceController } from './price.controller';
import { NotificationsModule } from '../notifications/notifications.module';  // Import NotificationsModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Price, Alert]),  // Register both Price and Alert entities here
    HttpModule,
    NotificationsModule,  // Import NotificationsModule here
  ],
  providers: [PriceService],
  controllers: [PriceController],
  exports: [PriceService],
})
export class PriceModule {}
