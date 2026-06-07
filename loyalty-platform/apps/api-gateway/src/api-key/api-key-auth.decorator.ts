import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from './api-key.guard';

export function UseApiKeyAuth() {
  return applyDecorators(
    SetMetadata('apiKeyAuth', true),
    UseGuards(ApiKeyGuard),
    ApiSecurity('ApiKey-auth'),
    ApiBearerAuth(),
  );
}
