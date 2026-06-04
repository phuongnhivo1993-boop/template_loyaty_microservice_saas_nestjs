import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { TenantGuard } from './tenant.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret:
        process.env.JWT_SECRET || 'loyalty_jwt_secret_key_change_in_production',
      signOptions: { expiresIn: (process.env.JWT_EXPIRATION || '24h') as any },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard, TenantGuard],
  exports: [AuthService, JwtModule, RolesGuard, TenantGuard],
})
export class AuthModule {}
