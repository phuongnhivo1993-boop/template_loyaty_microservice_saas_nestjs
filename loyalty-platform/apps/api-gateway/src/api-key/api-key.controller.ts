import { Controller, Get, Post, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApiKeyService } from './api-key.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateApiKeyDto } from './dto/api-key.dto';

@ApiTags('API Keys')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api-keys')
export class ApiKeyController {
  constructor(private apiKeyService: ApiKeyService) {}

  @Post()
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create a new API key' })
  create(@Req() req: any, @Body() body: CreateApiKeyDto) {
    return this.apiKeyService.create(req.tenantId, body);
  }

  @Get()
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'List API keys for tenant' })
  findAll(@Req() req: any) {
    return this.apiKeyService.findAll(req.tenantId);
  }

  @Get(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Get API key detail' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.apiKeyService.findOne(req.tenantId, id);
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Revoke API key' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.apiKeyService.remove(req.tenantId, id);
  }

  @Post(':id/regenerate')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Regenerate API key' })
  regenerate(@Req() req: any, @Param('id') id: string) {
    return this.apiKeyService.regenerate(req.tenantId, id);
  }
}
