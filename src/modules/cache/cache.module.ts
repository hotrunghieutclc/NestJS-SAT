import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheController } from './cache.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cache } from 'src/models';

@Module({
  controllers: [CacheController],
  providers: [CacheService],
  imports: [SequelizeModule.forFeature([Cache])],
})
export class CacheModule {}
