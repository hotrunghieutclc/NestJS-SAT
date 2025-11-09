import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalAuthGuard } from './guards/local-auth.guard'
import { JwtStrategy } from './strategies/jwt.startegy';
import { JwtGuard } from './guards/jwt.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, LocalAuthGuard, JwtStrategy, JwtGuard],
  imports: [UserModule],
  exports: [JwtGuard],
})
export class AuthModule {}
