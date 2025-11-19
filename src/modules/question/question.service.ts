import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Question, QuestionChoice } from 'src/models';
import { CreateQuestionDto, QuestionChoiceDto } from './dto/create-question.dto';
import { Sequelize } from 'sequelize-typescript';
import { FilterQuestionDto } from './dto/filter-question.dto';
import { ConfigService } from '@nestjs/config';
import { Op } from 'sequelize';

@Injectable()
export class QuestionService {
    constructor(
        private readonly sequelize: Sequelize,
        private readonly configService: ConfigService,
        @InjectModel(Question) private readonly questionModel: typeof Question,
        @InjectModel(QuestionChoice) private readonly questionChoiceModel: typeof QuestionChoice,
    ) {}

    async findQuestionById(id: number) {
        return this.questionModel.findOne({
            include: [
                {
                    model: QuestionChoice,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'questionId', 'id', 'choiceOrder']
                    },
                    order: ['choiceOrder', 'ASC']
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

    async findQuestionByHashId(hashId: number) {
        return this.questionModel.findOne({ raw: true, where: { hashId}})
    }

    async createQuestion(createQuestionDto: CreateQuestionDto) {
        const t = await this.sequelize.transaction();
        try {
            const question = await this.findQuestionByHashId(createQuestionDto.hashId);
            if(question) {
                throw new BadRequestException('Mã câu hỏi đã được dùng');
            }

            const newQuestion = await this.questionModel.create(createQuestionDto as any, { transaction: t});

            // Tạo câu trả lời nếu có
            if(createQuestionDto.questionChoices && createQuestionDto.questionChoices.length > 0 && newQuestion) {
                const questionId = newQuestion.id || newQuestion.dataValues?.id;
                console.log(questionId);
                const questionChoices = createQuestionDto.questionChoices.map((questionChoiceDto: QuestionChoiceDto) => ({
                    ...questionChoiceDto,
                    questionId,
                }));
                console.log(questionChoices);
                await this.questionChoiceModel.bulkCreate(questionChoices as any, {transaction: t});
            }

            await t.commit();
            return {
                message: 'Tạo câu hỏi thành công',
            }
        } catch (error) {
            const message = error?.message || 'Lỗi tạo câu hỏi';
            await t.rollback();
            throw new BadRequestException(message);
        }  
    }

    async findAllQuestions(filterQuestionDto: FilterQuestionDto) {
        const {
            search,
            page,
            limit,
            sortBy,
            sortOrder
        } = filterQuestionDto;

        const whereClause: any = {};
        if(search != undefined) {
            whereClause[Op.or] = [
                { content: {[Op.iLike]: `%${search}%` } },
                { hashId: {[Op.iLike]: `%${search}%` } },
            ];
        }

        const limitPage = Number(limit || this.configService.get<number>("LIMIT_DEFAULT"));
        const currentPage = Number(page || 1);
        const offset = (currentPage - 1) * limitPage;

        let orderClause: any[] = [];
        if(sortBy && sortOrder) {
            orderClause = [[sortBy, sortOrder]];
        } else {
            orderClause = [['createdAt', 'DESC']];
        }

        const {rows, count} = await this.questionModel.findAndCountAll({
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

    async delete(id: number) {
        await this.questionModel.destroy({
            where: { id  }
        });
        return {
            message: 'Xóa câu hỏi thành công'
        }
    }
}
