<<<<<<< HEAD
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IRLParameter, Question, QuestionChoice } from 'src/models';
import { CreateQuestionDto, IRLParameterDto, QuestionChoiceDto } from './dto/create-question.dto';
import { Sequelize } from 'sequelize-typescript';
import { FilterQuestionDto } from './dto/filter-question.dto';
import { ConfigService } from '@nestjs/config';
import { Op } from 'sequelize';
=======
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Question } from 'src/models/question.model';
import { QuestionChoice } from 'src/models/question-choice.model';
import { IRLParameter } from 'src/models/irl-parameter.model';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateQuestionChoiceDto, UpdateQuestionChoiceDto } from './dto/question-choice.dto';
import { CreateQuestionWithChoicesDto } from './dto/create-question-with-choices.dto';
>>>>>>> 2381e81f24a0c2faf66ca0175b91224ffc314060

@Injectable()
export class QuestionService {
    constructor(
<<<<<<< HEAD
        private readonly sequelize: Sequelize,
        private readonly configService: ConfigService,
        @InjectModel(Question) private readonly questionModel: typeof Question,
        @InjectModel(QuestionChoice) private readonly questionChoiceModel: typeof QuestionChoice,
        @InjectModel(IRLParameter) private readonly irlParameterModel: typeof IRLParameter
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
                },
                {
                    model: IRLParameter,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'questionId', 'id']
                    }
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

    async createQuestion(createQuestionDto: CreateQuestionDto) {
        const t = await this.sequelize.transaction();
        try {

            const newQuestion = await this.questionModel.create(createQuestionDto as any, { transaction: t});

            // Tạo câu trả lời nếu có
            if(createQuestionDto.questionChoices && createQuestionDto.questionChoices.length > 0 && newQuestion) {
                const questionId = newQuestion.id || newQuestion.dataValues?.id;
                const questionChoices = createQuestionDto.questionChoices.map((questionChoiceDto: QuestionChoiceDto) => ({
                    ...questionChoiceDto,
                    questionId,
                }));
                await this.questionChoiceModel.bulkCreate(questionChoices as any, {transaction: t});
            }

            // Tạo parameter
            if(createQuestionDto.irlParameter && newQuestion) {
                const questionId = newQuestion.id || newQuestion.dataValues?.id;
                const irlParameter = {
                    ...createQuestionDto.irlParameter,
                    questionId,
                }
                await this.irlParameterModel.create(irlParameter as any, {transaction: t})
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
=======
        @InjectModel(Question) private readonly questionModel: typeof Question,
        @InjectModel(QuestionChoice) private readonly questionChoiceModel: typeof QuestionChoice,
        @InjectModel(IRLParameter) private readonly irlParameterModel: typeof IRLParameter,
    ) {}

    // ==================== QUESTION CRUD ====================

    async create(createQuestionDto: CreateQuestionDto) {
        const question = await this.questionModel.create(createQuestionDto as any);

        return {
            message: 'Tạo câu hỏi thành công',
            data: question
        };
    }

    async createWithChoices(createDto: CreateQuestionWithChoicesDto) {
        // Tạo câu hỏi
        const { choices, ...questionData } = createDto;
        const question = await this.questionModel.create(questionData as any);

        // Tạo các lựa chọn
        const createdChoices: QuestionChoice[] = [];
        for (const choice of choices) {
            const newChoice = await this.questionChoiceModel.create({
                ...choice,
                questionId: question.id
            } as any);
            createdChoices.push(newChoice);
        }

        return {
            message: 'Tạo câu hỏi và lựa chọn thành công',
            data: {
                ...question.toJSON(),
                choices: createdChoices
            }
        };
    }

    async findAll(page: number = 1, limit: number = 10, section?: string, skill?: string, difficulty?: string) {
        const offset = (page - 1) * limit;
        const whereClause: any = {};

        if (section) whereClause.section = section;
        if (skill) whereClause.skill = skill;
        if (difficulty) whereClause.difficulty = difficulty;

        const { count, rows } = await this.questionModel.findAndCountAll({
            where: whereClause,
            include: [
                { model: QuestionChoice },
                { model: IRLParameter }
            ],
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        return {
            message: 'Lấy danh sách câu hỏi thành công',
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        };
    }

    async findOne(id: number) {
        const question = await this.questionModel.findByPk(id, {
            include: [
                { model: QuestionChoice },
                { model: IRLParameter }
            ]
        });

        if (!question) {
            throw new NotFoundException('Không tìm thấy câu hỏi');
        }

        return {
            message: 'Lấy câu hỏi thành công',
            data: question
        };
    }

    async update(id: number, updateQuestionDto: UpdateQuestionDto) {
        const question = await this.questionModel.findByPk(id);

        if (!question) {
            throw new NotFoundException('Không tìm thấy câu hỏi');
        }

        await question.update(updateQuestionDto);

        return {
            message: 'Cập nhật câu hỏi thành công',
            data: question
        };
    }

    async delete(id: number) {
        const question = await this.questionModel.findByPk(id);

        if (!question) {
            throw new NotFoundException('Không tìm thấy câu hỏi');
        }

        // Xóa các lựa chọn liên quan
        await this.questionChoiceModel.destroy({ where: { questionId: id } });
        
        // Xóa IRL parameter liên quan
        await this.irlParameterModel.destroy({ where: { questionId: id } });
        
        await question.destroy();

        return {
            message: 'Xóa câu hỏi thành công'
        };
    }

    // ==================== QUESTION CHOICE CRUD ====================

    async addChoice(questionId: number, createChoiceDto: CreateQuestionChoiceDto) {
        const question = await this.questionModel.findByPk(questionId);

        if (!question) {
            throw new NotFoundException('Không tìm thấy câu hỏi');
        }

        const choice = await this.questionChoiceModel.create({
            ...createChoiceDto,
            questionId
        } as any);

        return {
            message: 'Thêm lựa chọn thành công',
            data: choice
        };
    }

    async updateChoice(questionId: number, choiceId: number, updateChoiceDto: UpdateQuestionChoiceDto) {
        const choice = await this.questionChoiceModel.findOne({
            where: { id: choiceId, questionId }
        });

        if (!choice) {
            throw new NotFoundException('Không tìm thấy lựa chọn');
        }

        await choice.update(updateChoiceDto);

        return {
            message: 'Cập nhật lựa chọn thành công',
            data: choice
        };
    }

    async deleteChoice(questionId: number, choiceId: number) {
        const choice = await this.questionChoiceModel.findOne({
            where: { id: choiceId, questionId }
        });

        if (!choice) {
            throw new NotFoundException('Không tìm thấy lựa chọn');
        }

        await choice.destroy();

        return {
            message: 'Xóa lựa chọn thành công'
        };
    }

    async getChoices(questionId: number) {
        const question = await this.questionModel.findByPk(questionId);

        if (!question) {
            throw new NotFoundException('Không tìm thấy câu hỏi');
        }

        const choices = await this.questionChoiceModel.findAll({
            where: { questionId },
            order: [['choiceOrder', 'ASC']]
        });

        return {
            message: 'Lấy danh sách lựa chọn thành công',
            data: choices
        };
    }

    // ==================== IRL PARAMETER ====================

    async setIRLParameter(questionId: number, a: number, b: number, c: number) {
        const question = await this.questionModel.findByPk(questionId);

        if (!question) {
            throw new NotFoundException('Không tìm thấy câu hỏi');
        }

        let irlParam = await this.irlParameterModel.findOne({ where: { questionId } });

        if (irlParam) {
            await irlParam.update({ a, b, c });
        } else {
            irlParam = await this.irlParameterModel.create({
                questionId,
                a,
                b,
                c
            } as any);
        }

        return {
            message: 'Cập nhật IRL parameter thành công',
            data: irlParam
        };
>>>>>>> 2381e81f24a0c2faf66ca0175b91224ffc314060
    }
}
