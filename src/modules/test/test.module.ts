import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AIEvualuation, Question, TestResponse, TestSession } from 'src/models';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [TestController],
  providers: [TestService],
  imports: [SequelizeModule.forFeature([TestSession, TestResponse, Question, AIEvualuation]), UserModule], 
})
export class TestModule {}
