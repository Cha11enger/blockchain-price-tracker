// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ConfigService } from '@nestjs/config';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const configService = app.get(ConfigService);
//   const port = configService.get<number>('PORT') || 3000;
//   await app.listen(port);
// }
// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Blockchain Price Tracker API')
    .setDescription('APIs for tracking cryptocurrency prices, setting alerts, and calculating swap rates.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
