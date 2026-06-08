import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { TenantGuard } from './tenant.guard';
import { TokenBlacklistService } from './token-blacklist.service';
import { NotificationModule } from '../notification/notification.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    CommonModule,
    NotificationModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (): any => {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          throw new Error('JWT_SECRET environment variable is required');
        }
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: process.env.JWT_EXPIRATION || '24h' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard, TenantGuard, TokenBlacklistService],
  exports: [AuthService, JwtModule, RolesGuard, TenantGuard, TokenBlacklistService],
})
export class AuthModule {}
