import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PartnershipService } from './partnership.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Partnership')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('partnership')
export class PartnershipController {
  constructor(private partnershipService: PartnershipService) {}

  @Post('brands')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create partner brand' })
  createBrand(@Body() body: any) {
    return this.partnershipService.createBrand(body);
  }

  @Get('brands')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'List partner brands' })
  listBrands(@Query() query: any) {
    return this.partnershipService.listBrands(query.tenantId, query.page, query.limit, query.search, query.status, query.sort);
  }

  @Get('brands/:id')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get partner brand' })
  getBrand(@Param('id') id: string) {
    return this.partnershipService.getBrand(id);
  }

  @Put('brands/:id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update partner brand' })
  updateBrand(@Param('id') id: string, @Body() body: any) {
    return this.partnershipService.updateBrand(id, body);
  }

  @Delete('brands/:id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete partner brand' })
  deleteBrand(@Param('id') id: string) {
    return this.partnershipService.deleteBrand(id);
  }

  @Post('brands/:brandId/rewards')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create partner reward' })
  createReward(@Param('brandId') brandId: string, @Body() body: any) {
    return this.partnershipService.createReward(brandId, body);
  }

  @Get('brands/:brandId/rewards')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'List partner rewards' })
  listRewards(@Param('brandId') brandId: string, @Query() query: any) {
    return this.partnershipService.listRewards(brandId, query.page, query.limit);
  }

  @Put('rewards/:id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update partner reward' })
  updateReward(@Param('id') id: string, @Body() body: any) {
    return this.partnershipService.updateReward(id, body);
  }

  @Delete('rewards/:id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete partner reward' })
  deleteReward(@Param('id') id: string) {
    return this.partnershipService.deleteReward(id);
  }

  @Post('redeem')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Redeem partner reward with member points' })
  redeemReward(@Body() body: any) {
    return this.partnershipService.redeemReward(body.memberId, body.rewardId, body.quantity);
  }
}
