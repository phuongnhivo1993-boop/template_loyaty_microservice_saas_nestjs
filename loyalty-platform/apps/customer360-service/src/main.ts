import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Customer360ServiceModule } from './customer360-service.module';

async function bootstrap() {
  const logger = new Logger('Customer360Service');
  const app = await NestFactory.create(Customer360ServiceModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Customer 360 Service')
    .setDescription('Unified customer profile across all services')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.CUSTOMER360_SERVICE_PORT ?? 3012;
  await app.listen(port);
  logger.log(`Customer 360 Service running on port ${port}`);
}
bootstrap();
