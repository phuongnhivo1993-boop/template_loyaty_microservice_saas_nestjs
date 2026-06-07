import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto, UpdateInvoiceDto, InvoiceQueryDto } from './dto/invoice.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Post()
  @Roles('HOST')
  @ApiOperation({ summary: 'Create invoice' })
  create(@Body() dto: CreateInvoiceDto) {
    return this.invoiceService.create(dto);
  }

  @Get()
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'List all invoices (paginated, searchable)' })
  findAll(@Query() query: InvoiceQueryDto) {
    return this.invoiceService.findAll(query);
  }

  @Get(':id')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get invoice detail' })
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }

  @Get('tenant/:tenantId')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get invoices for a tenant' })
  findByTenant(
    @Param('tenantId') tenantId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.invoiceService.findByTenant(tenantId, page, limit);
  }

  @Put(':id')
  @Roles('HOST')
  @ApiOperation({ summary: 'Update invoice status' })
  update(@Param('id') id: string, @Body() dto: UpdateInvoiceDto) {
    return this.invoiceService.update(id, dto);
  }

  @Delete(':id')
  @Roles('HOST')
  @ApiOperation({ summary: 'Delete invoice' })
  remove(@Param('id') id: string) {
    return this.invoiceService.remove(id);
  }
}
