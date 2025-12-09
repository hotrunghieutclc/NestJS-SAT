import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AIEvualuation, Cache, IRLParameter, Question, QuestionChoice, TestResponse, TestSession, User } from 'src/models';


@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [SequelizeModule.forFeature([AIEvualuation, Cache, IRLParameter, Question, QuestionChoice, TestResponse, TestSession, User])]
})
export class SeedModule {}
