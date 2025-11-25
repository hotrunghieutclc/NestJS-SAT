import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/sequelize';
import { AIEvualuation, Question, TestResponse, TestSession } from 'src/models';
import { CreateTestDto } from './dto/create-test.dto';
import { Sequelize } from 'sequelize-typescript';
import { FilterTestDto } from './dto/filter-test.dto';
import { Op } from 'sequelize';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TestService {
    constructor(
        private readonly sequelize: Sequelize,
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        @InjectModel(TestSession) private readonly testModel: typeof TestSession,
        @InjectModel(TestResponse) private readonly testResponseModel: typeof TestResponse,
        @InjectModel(AIEvualuation) private readonly aiEvualationModel: typeof AIEvualuation,
        @InjectModel(Question) private readonly questionModel: typeof Question,
    ) { }

    async findTestById(id: number) {
        return this.testModel.findOne({
            include: [
                {
                    model: AIEvualuation,
                    attributes: ['evaluationText']
                },
                {
                    model: TestResponse,
                    attributes: ['questionId', 'selectChoiceId', 'isCorrect', 'responseTime', 'thetaAfter']
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            where: {
                id,
            }
        })
    }

    async create(createTestDto: CreateTestDto) {
        const t = await this.sequelize.transaction();
        try {
            const user = await this.userService.findById(createTestDto.userId)
            if(!user) {
                 throw new BadRequestException('Không thấy người dùng');
            }
            const newTest = await this.testModel.create(createTestDto as any, {transaction: t})
            console.log(newTest)
            // Tạo AIEva
            if(createTestDto.aiEvualuation && newTest) {
                const sessionId = newTest.id || newTest.dataValues?.id;
                const aiEvaluation = {
                    ...createTestDto.aiEvualuation,
                    sessionId
                }
                await this.aiEvualationModel.create(aiEvaluation as any, {transaction: t})
            }

            // Tạo Response
            if(createTestDto.testResponses && createTestDto.testResponses.length > 0 && newTest) {
                const sessionId = newTest.id || newTest.dataValues?.id;
                const questionsIds = createTestDto.testResponses.map((qustion) => qustion.questionId);
                const alreadyExists = await this.questionModel.findAll({
                    where: {
                        id: questionsIds
                    },
                    attributes: ['id']
                })
                if(alreadyExists.length !== createTestDto.testResponses.length) {
                    throw new BadRequestException('Có vài câu hỏi không hợp lệ')
                }
                const testResposes = createTestDto.testResponses.map((testResponse) => ({
                    ...testResponse,
                    sessionId,
                }));
                await this.testResponseModel.bulkCreate(testResposes as any, {transaction: t});
            }
        await t.commit();
        return {
            message: 'Tạo bài kiểm tra thành công'
        }
        } catch(error) {
            const message = error.message || 'Tạo bài kiểm tra thất bại.'
            await t.rollback();
            throw new BadRequestException(message);
        }
    }

    async findAll(filterTestDto: FilterTestDto) {
        const {
            search,
            sortBy,
            sortOrder,
            page,
            limit
        } = filterTestDto;

        const whereClause: any = {}
        if(search !== undefined) {
            whereClause[Op.or] = [
                {skill: {[Op.iLike]: `%${search}%`}}
            ];
        }

        const limitPage = Number(limit || this.configService.get<number>("LIMIT_DEFAULT"));
        const currentPage = Number(page || 1);
        const offset = (currentPage - 1) * limitPage;

        let orderClause: any[] = [];
        if(sortBy && sortOrder) {
            orderClause = [[sortBy, sortOrder]];
        } else {
            orderClause = [['startedAt', 'ASC']];
        }

        const {rows, count} = await this.testModel.findAndCountAll({
            where: whereClause,
            order: orderClause,
            limit: limitPage,
            offset,
            raw: true
        });

        const totalItems = Array.isArray(count) ? count.length : count;

        return {
            items: rows,
            paginationMeta: {
                totalItems,
                currentPage,
                limit: limitPage,
                totalPages: Math.ceil(totalItems / limitPage),
            }
        }
    }

    async remove(id: number) {
        await this.testModel.destroy({where: {id}, cascade: true});
        return { message: 'Xóa bài kt thành công'}
    }
}
