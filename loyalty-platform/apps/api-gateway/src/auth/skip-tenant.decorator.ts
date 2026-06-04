import { SetMetadata } from '@nestjs/common';

export const TENANT_SKIP_KEY = 'skipTenantCheck';
export const SkipTenantCheck = () => SetMetadata(TENANT_SKIP_KEY, true);
