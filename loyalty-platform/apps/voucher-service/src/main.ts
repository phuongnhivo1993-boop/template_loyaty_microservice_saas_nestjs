import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { VoucherServiceModule } from './voucher-service.module';

async function bootstrap() {
  const logger = new Logger('VoucherService');
  const app = await NestFactory.create(VoucherServiceModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Voucher Service')
    .setDescription('Voucher creation, series, redemption')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.VOUCHER_SERVICE_PORT ?? 3007;
  await app.listen(port);
  logger.log(`Voucher Service running on port ${port}`);
}
bootstrap();
