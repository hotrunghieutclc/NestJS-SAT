import { Module } from '@nestjs/common';
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
})
export class QuestionModule {}
