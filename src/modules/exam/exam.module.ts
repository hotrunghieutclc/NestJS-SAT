import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Exam, ExamQuestion, Question, QuestionChoice, User } from 'src/models';

@Module({
    controllers: [ExamController],
    providers: [ExamService],
    imports: [SequelizeModule.forFeature([Exam, ExamQuestion, Question, QuestionChoice, User])],
    exports: [ExamService],
})
export class ExamModule { }
