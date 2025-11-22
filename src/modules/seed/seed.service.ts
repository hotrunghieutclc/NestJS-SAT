import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { AIEvualuation, Cache, IRLParameter, Question, QuestionChoice, TestResponse, TestSession, User } from 'src/models';
import { questions } from './data';

@Injectable()
export class SeedService {
    constructor(
        @InjectModel(AIEvualuation) private readonly aiEvulationModel: typeof AIEvualuation,
        @InjectModel(Cache) private readonly cacheModel: typeof Cache,
        @InjectModel(IRLParameter) private readonly irlParameterModel: typeof IRLParameter,
        @InjectModel(Question) private readonly questionModel: typeof Question,
        @InjectModel(QuestionChoice) private readonly questionChoiceModel: typeof QuestionChoice,
        @InjectModel(TestResponse) private readonly testResponseModel: typeof TestResponse,
        @InjectModel(TestSession) private readonly testSessionModel: typeof TestSession,
        @InjectModel(User) private readonly userModel: typeof User,
        private readonly sequelize: Sequelize,

    ) {}

    private async seedQuestions(transaction: Transaction) {
        return await this.questionModel.bulkCreate(questions as any, { transaction})
    }

    async initSeedData() {
        const transaction = await this.sequelize.transaction(); // trả lại các thao tác trước đó
        try {
            await this.seedQuestions(transaction);

            await transaction.commit();
            return { message: 'Seed data success'}
        } catch(error) {
            await transaction.rollback();
            throw new BadRequestException('Seed data failed');
        }
    }
}
