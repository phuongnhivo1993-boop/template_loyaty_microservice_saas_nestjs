import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PromotionServiceModule } from './promotion-service.module';

async function bootstrap() {
  const logger = new Logger('PromotionService');
  const app = await NestFactory.create(PromotionServiceModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.use((req: any, res: any, next: any) => {
    const publicPaths = ['/api/v1/health'];
    if (publicPaths.includes(req.path)) return next();
    const apiKey = req.headers['x-api-key'];
    const expectedKey = process.env.INTERNAL_API_KEY || 'loyalty-internal-key-dev';
    if (!apiKey || apiKey !== expectedKey) {
      return res.status(401).json({ statusCode: 401, message: 'Invalid or missing API key' });
    }
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('Promotion Service')
    .setDescription('Promotion rule engine, conditions, actions')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PROMOTION_SERVICE_PORT ?? 3008;
  await app.listen(port);
  logger.log(`Promotion Service running on port ${port}`);
}
bootstrap();
