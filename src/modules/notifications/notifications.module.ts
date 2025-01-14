import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Module({
  providers: [NotificationsService],
  exports: [NotificationsService],  // Export the service so it can be used in other modules
})
export class NotificationsModule {}
