import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private apiInstance: SibApiV3Sdk.TransactionalEmailsApi;

  constructor() {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  }

  // This method runs when the service is initialized
  async onModuleInit() {
    this.logger.log('Application started, sending test email...');
    await this.sendEmail(
      'ranjithkumar@yopmail.com',  // Replace with your email for testing
      'Test Email on Application Startup',
      'This is a test email to check if Brevo SMTP works correctly.'
    );
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.sender = { name: 'Blockchain Price Tracker', email: process.env.SMTP_FROM_EMAIL };
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.htmlContent = `<html><body><p>${text}</p></body></html>`;

    try {
      const data = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      this.logger.log(`Test email sent to ${to}: ${subject}. Response: ${JSON.stringify(data)}`);
    } catch (error) {
      this.logger.error(`Failed to send test email to ${to}: ${error.message}`);
    }
  }
}
