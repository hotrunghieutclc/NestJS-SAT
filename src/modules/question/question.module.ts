import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { IRLParameter, Question, QuestionChoice } from 'src/models';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService],
  imports: [SequelizeModule.forFeature([Question, QuestionChoice, IRLParameter])], 
=======
import { SequelizeModule } from '@nestjs/sequelize';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { Question } from 'src/models/question.model';
import { QuestionChoice } from 'src/models/question-choice.model';
import { IRLParameter } from 'src/models/irl-parameter.model';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        SequelizeModule.forFeature([Question, QuestionChoice, IRLParameter]),
        AuthModule
    ],
    controllers: [QuestionController],
    providers: [QuestionService],
    exports: [QuestionService]
>>>>>>> 2381e81f24a0c2faf66ca0175b91224ffc314060
})
export class QuestionModule {}
