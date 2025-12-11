import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Exam, ExamQuestion, Question, QuestionChoice, User } from 'src/models';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { FilterExamDto } from './dto/filter-exam.dto';
import { AddQuestionsToExamDto, RemoveQuestionsFromExamDto } from './dto/manage-exam-questions.dto';
import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import { Op } from 'sequelize';

@Injectable()
export class ExamService {
    constructor(
        private readonly sequelize: Sequelize,
        private readonly configService: ConfigService,
        @InjectModel(Exam) private readonly examModel: typeof Exam,
        @InjectModel(ExamQuestion) private readonly examQuestionModel: typeof ExamQuestion,
        @InjectModel(Question) private readonly questionModel: typeof Question,
        @InjectModel(User) private readonly userModel: typeof User,
    ) { }

    // Lấy chi tiết đề thi theo ID
    async findExamById(id: number) {
        const exam = await this.examModel.findOne({
            where: { id },
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'username', 'email']
                },
                {
                    model: ExamQuestion,
                    include: [
                        {
                            model: Question,
                            include: [
                                {
                                    model: QuestionChoice,
                                    attributes: {
                                        exclude: ['createdAt', 'updatedAt']
                                    }
                                }
                            ],
                            attributes: {
                                exclude: ['createdAt', 'updatedAt']
                            }
                        }
                    ],
                    attributes: ['id', 'questionId', 'questionOrder', 'point']
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });

        if (!exam) {
            throw new NotFoundException('Không tìm thấy đề thi');
        }

        return exam;
    }

    // Tạo đề thi mới
    async createExam(createExamDto: CreateExamDto) {
        const t = await this.sequelize.transaction();
        try {
            // Kiểm tra người tạo có tồn tại không
            const user = await this.userModel.findByPk(createExamDto.createdBy);
            if (!user) {
                throw new BadRequestException('Không tìm thấy người dùng');
            }

            // Tạo đề thi
            const newExam = await this.examModel.create({
                title: createExamDto.title,
                description: createExamDto.description,
                duration: createExamDto.duration || 60,
                isActive: createExamDto.isActive !== undefined ? createExamDto.isActive : true,
                section: createExamDto.section,
                difficulty: createExamDto.difficulty,
                createdBy: createExamDto.createdBy,
            } as any, { transaction: t });

            // Thêm câu hỏi vào đề nếu có
            if (createExamDto.questions && createExamDto.questions.length > 0) {
                const examId = newExam.id || newExam.dataValues?.id;
                
                // Kiểm tra các câu hỏi có tồn tại không
                const questionIds = createExamDto.questions.map(q => q.questionId);
                const existingQuestions = await this.questionModel.findAll({
                    where: { id: questionIds },
                    attributes: ['id']
                });

                if (existingQuestions.length !== questionIds.length) {
                    throw new BadRequestException('Có một số câu hỏi không tồn tại');
                }

                // Tạo các exam-question records
                const examQuestions = createExamDto.questions.map((q, index) => ({
                    examId,
                    questionId: q.questionId,
                    questionOrder: q.questionOrder || index + 1,
                    point: q.point || 1,
                }));

                await this.examQuestionModel.bulkCreate(examQuestions as any, { transaction: t });
            }

            await t.commit();
            return {
                message: 'Tạo đề thi thành công',
                examId: newExam.id || newExam.dataValues?.id
            };
        } catch (error) {
            await t.rollback();
            const message = error.message || 'Tạo đề thi thất bại';
            throw new BadRequestException(message);
        }
    }

    // Cập nhật đề thi
    async updateExam(id: number, updateExamDto: UpdateExamDto) {
        const t = await this.sequelize.transaction();
        try {
            const exam = await this.examModel.findByPk(id);
            if (!exam) {
                throw new NotFoundException('Không tìm thấy đề thi');
            }

            // Cập nhật thông tin đề thi
            await this.examModel.update(
                {
                    title: updateExamDto.title,
                    description: updateExamDto.description,
                    duration: updateExamDto.duration,
                    isActive: updateExamDto.isActive,
                    section: updateExamDto.section,
                    difficulty: updateExamDto.difficulty,
                },
                {
                    where: { id },
                    transaction: t
                }
            );

            // Nếu có cập nhật danh sách câu hỏi
            if (updateExamDto.questions !== undefined) {
                // Xóa tất cả câu hỏi cũ
                await this.examQuestionModel.destroy({
                    where: { examId: id },
                    transaction: t
                });

                // Thêm câu hỏi mới nếu có
                if (updateExamDto.questions.length > 0) {
                    const questionIds = updateExamDto.questions.map(q => q.questionId);
                    const existingQuestions = await this.questionModel.findAll({
                        where: { id: questionIds },
                        attributes: ['id']
                    });

                    if (existingQuestions.length !== questionIds.length) {
                        throw new BadRequestException('Có một số câu hỏi không tồn tại');
                    }

                    const examQuestions = updateExamDto.questions.map((q, index) => ({
                        examId: id,
                        questionId: q.questionId,
                        questionOrder: q.questionOrder || index + 1,
                        point: q.point || 1,
                    }));

                    await this.examQuestionModel.bulkCreate(examQuestions as any, { transaction: t });
                }
            }

            await t.commit();
            return {
                message: 'Cập nhật đề thi thành công'
            };
        } catch (error) {
            await t.rollback();
            const message = error.message || 'Cập nhật đề thi thất bại';
            throw new BadRequestException(message);
        }
    }

    // Lấy danh sách đề thi
    async findAllExams(filterExamDto: FilterExamDto) {
        const {
            search,
            section,
            difficulty,
            sortBy,
            sortOrder,
            page,
            limit
        } = filterExamDto;

        const whereClause: any = {};

        if (search) {
            whereClause[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
            ];
        }

        if (section) {
            whereClause.section = section;
        }

        if (difficulty) {
            whereClause.difficulty = difficulty;
        }

        const limitPage = Number(limit || this.configService.get<number>('LIMIT_DEFAULT') || 10);
        const currentPage = Number(page || 1);
        const offset = (currentPage - 1) * limitPage;

        let orderClause: any[] = [];
        if (sortBy && sortOrder) {
            orderClause = [[sortBy, sortOrder]];
        } else {
            orderClause = [['createdAt', 'DESC']];
        }

        const { rows, count } = await this.examModel.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'username']
                }
            ],
            attributes: {
                exclude: ['updatedAt']
            },
            order: orderClause,
            limit: limitPage,
            offset,
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
        };
    }

    // Xóa đề thi
    async deleteExam(id: number) {
        const exam = await this.examModel.findByPk(id);
        if (!exam) {
            throw new NotFoundException('Không tìm thấy đề thi');
        }

        // Xóa tất cả exam-question liên quan
        await this.examQuestionModel.destroy({
            where: { examId: id }
        });

        await this.examModel.destroy({
            where: { id }
        });

        return {
            message: 'Xóa đề thi thành công'
        };
    }

    // Thêm câu hỏi vào đề thi
    async addQuestionsToExam(examId: number, addQuestionsDto: AddQuestionsToExamDto) {
        const t = await this.sequelize.transaction();
        try {
            const exam = await this.examModel.findByPk(examId);
            if (!exam) {
                throw new NotFoundException('Không tìm thấy đề thi');
            }

            // Kiểm tra câu hỏi có tồn tại không
            const questionIds = addQuestionsDto.questions.map(q => q.questionId);
            const existingQuestions = await this.questionModel.findAll({
                where: { id: questionIds },
                attributes: ['id']
            });

            if (existingQuestions.length !== questionIds.length) {
                throw new BadRequestException('Có một số câu hỏi không tồn tại');
            }

            // Kiểm tra câu hỏi đã có trong đề chưa
            const existingExamQuestions = await this.examQuestionModel.findAll({
                where: {
                    examId,
                    questionId: questionIds
                },
                attributes: ['questionId']
            });

            if (existingExamQuestions.length > 0) {
                const existingIds = existingExamQuestions.map(eq => eq.questionId);
                throw new BadRequestException(`Các câu hỏi ${existingIds.join(', ')} đã có trong đề thi`);
            }

            // Lấy thứ tự lớn nhất hiện tại
            const maxOrder = await this.examQuestionModel.max('questionOrder', {
                where: { examId }
            }) as number || 0;

            // Thêm câu hỏi mới
            const examQuestions = addQuestionsDto.questions.map((q, index) => ({
                examId,
                questionId: q.questionId,
                questionOrder: q.questionOrder || maxOrder + index + 1,
                point: q.point || 1,
            }));

            await this.examQuestionModel.bulkCreate(examQuestions as any, { transaction: t });

            await t.commit();
            return {
                message: 'Thêm câu hỏi vào đề thi thành công'
            };
        } catch (error) {
            await t.rollback();
            const message = error.message || 'Thêm câu hỏi vào đề thi thất bại';
            throw new BadRequestException(message);
        }
    }

    // Xóa câu hỏi khỏi đề thi
    async removeQuestionsFromExam(examId: number, removeQuestionsDto: RemoveQuestionsFromExamDto) {
        const exam = await this.examModel.findByPk(examId);
        if (!exam) {
            throw new NotFoundException('Không tìm thấy đề thi');
        }

        await this.examQuestionModel.destroy({
            where: {
                examId,
                questionId: removeQuestionsDto.questionIds
            }
        });

        return {
            message: 'Xóa câu hỏi khỏi đề thi thành công'
        };
    }

    // Cập nhật thông tin câu hỏi trong đề (thứ tự, điểm)
    async updateExamQuestion(examId: number, questionId: number, data: { questionOrder?: number; point?: number }) {
        const examQuestion = await this.examQuestionModel.findOne({
            where: { examId, questionId }
        });

        if (!examQuestion) {
            throw new NotFoundException('Không tìm thấy câu hỏi trong đề thi');
        }

        await this.examQuestionModel.update(data, {
            where: { examId, questionId }
        });

        return {
            message: 'Cập nhật thông tin câu hỏi trong đề thành công'
        };
    }

    // Lấy danh sách câu hỏi trong đề
    async getExamQuestions(examId: number) {
        const exam = await this.examModel.findByPk(examId);
        if (!exam) {
            throw new NotFoundException('Không tìm thấy đề thi');
        }

        const examQuestions = await this.examQuestionModel.findAll({
            where: { examId },
            include: [
                {
                    model: Question,
                    include: [
                        {
                            model: QuestionChoice,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt']
                            }
                        }
                    ],
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ],
            order: [['questionOrder', 'ASC']],
            attributes: ['id', 'questionId', 'questionOrder', 'point']
        });

        return {
            examId,
            examTitle: exam.title,
            totalQuestions: examQuestions.length,
            questions: examQuestions
        };
    }
}
