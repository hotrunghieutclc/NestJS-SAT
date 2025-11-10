import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { StartTimingMiddleware } from './common/middlewares/start-timing.middleware';
import { JwtModule, } from '@nestjs/jwt';
import { sequelizeConfig } from './config/sequelize.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): SequelizeModuleOptions =>
        sequelizeConfig(configService),
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<any>('JWT_EXPIRES_IN'),
        },
      }),
      global: true,
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(StartTimingMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL});
  }
}

