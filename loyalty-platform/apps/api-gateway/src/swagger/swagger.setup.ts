import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function setupSwagger(app: INestApplication, appUrl: string): void {
  const options = new DocumentBuilder()
    .setTitle('Loyalty Platform API')
    .setDescription('Multi-tenant loyalty platform API')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } as SecuritySchemeObject,
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
