import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { Test } from 'src/models/test.model';
import { Answer } from 'src/models/answer.model';
import { Question } from 'src/models/question.model';
import { Item } from 'src/models/item.model';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        SequelizeModule.forFeature([Test, Answer, Question, Item]),
        AuthModule
    ],
    controllers: [TestController],
    providers: [TestService],
    exports: [TestService]
})
export class TestModule {}
