import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { IRLParameter, Question, QuestionChoice } from 'src/models';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService],
  imports: [SequelizeModule.forFeature([Question, QuestionChoice, IRLParameter])], 
})
export class QuestionModule {}
