import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { Question } from 'src/models/question.model';
import { AuthModule } from '../auth/auth.module';
import { Answer, Item, Test } from 'src/models';

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
