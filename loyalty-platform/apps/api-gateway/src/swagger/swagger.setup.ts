import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


export function setupSwagger(app: INestApplication, appUrl: string): void {
  const options = new DocumentBuilder()
    .setTitle('Loyalty Platform API')
    .setDescription('Multi-tenant loyalty platform API')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http' as const, scheme: 'bearer' as const, bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .addApiKey(
      { type: 'apiKey', name: 'x-api-key', in: 'header' },
      'ApiKey-auth',
    )
    .addApiKey(
      { type: 'apiKey', name: 'tenant-id', in: 'header' },
      'TenantId-auth',
    )
    .addServer(appUrl)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
}
