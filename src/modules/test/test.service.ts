import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Test } from 'src/models/test.model';
import { Answer } from 'src/models/answer.model';
import { Question } from 'src/models/question.model';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { AddQuestionsToTestDto } from './dto/add-questions-to-test.dto';
import { Item } from 'src/models/item.model';
import { QuestionChoice } from 'src/models/question-choice.model';

@Injectable()
export class TestService {
    constructor(
        @InjectModel(Test) private readonly testModel: typeof Test,
        @InjectModel(Answer) private readonly answerModel: typeof Answer,
        @InjectModel(Question) private readonly questionModel: typeof Question,
        @InjectModel(Item) private readonly itemModel: typeof Item,
    ) {}

    async create(userId: number, createTestDto: CreateTestDto) {
        const test = await this.testModel.create({
            ...createTestDto,
            userId,
            startedAt: new Date(),
        } as any);

        return {
            message: 'Tạo đề thi thành công',
            data: test
        };
    }

    async findAll(userId: number) {
        const tests = await this.testModel.findAll({
            where: { userId },
            include: [{ model: Answer }]
        });

        return {
            message: 'Lấy danh sách đề thi thành công',
            data: tests
        };
    }

    async findOne(id: number, userId: number) {
        const test = await this.testModel.findOne({
            where: { id, userId },
            include: [{ model: Answer }]
        });

        if (!test) {
            throw new NotFoundException('Không tìm thấy đề thi');
        }

        return {
            message: 'Lấy đề thi thành công',
            data: test
        };
    }

    async update(id: number, userId: number, updateTestDto: UpdateTestDto) {
        const test = await this.testModel.findOne({ where: { id, userId } });

        if (!test) {
            throw new NotFoundException('Không tìm thấy đề thi');
        }

        await test.update(updateTestDto);

        return {
            message: 'Cập nhật đề thi thành công',
            data: test
        };
    }

    async delete(id: number, userId: number) {
        const test = await this.testModel.findOne({ where: { id, userId } });

        if (!test) {
            throw new NotFoundException('Không tìm thấy đề thi');
        }

        // Xóa các câu trả lời liên quan
        await this.answerModel.destroy({ where: { testId: id } });
        
        await test.destroy();

        return {
            message: 'Xóa đề thi thành công'
        };
    }

    async addQuestionsToTest(testId: number, userId: number, addQuestionsDto: AddQuestionsToTestDto) {
        const test = await this.testModel.findOne({ where: { id: testId, userId } });

        if (!test) {
            throw new NotFoundException('Không tìm thấy đề thi');
        }

        const { questionIds } = addQuestionsDto;

        // Tìm các item tương ứng với questionId (dựa trên cấu trúc database hiện tại)
        // Trong database hiện tại, Item có trường questionId là foreign key
        const items = await this.itemModel.findAll({
            where: { id: questionIds }
        });

        if (items.length === 0) {
            throw new BadRequestException('Không tìm thấy câu hỏi nào');
        }

        // Tạo các answer liên kết item với đề
        const answers: Answer[] = [];
        for (const item of items) {
            // Kiểm tra xem item đã có trong đề chưa
            const existingAnswer = await this.answerModel.findOne({
                where: { testId, itemId: item.id }
            });

            if (!existingAnswer) {
                const answer = await this.answerModel.create({
                    testId,
                    itemId: item.id,
                    answeresAt: new Date(),
                } as any);
                answers.push(answer);
            }
        }

        // Cập nhật số lượng câu hỏi
        const totalAnswers = await this.answerModel.count({ where: { testId } });
        await test.update({ quantities: totalAnswers });

        return {
            message: 'Thêm câu hỏi vào đề thi thành công',
            data: {
                addedCount: answers.length,
                totalQuestions: totalAnswers
            }
        };
    }

    async removeQuestionFromTest(testId: number, userId: number, itemId: number) {
        const test = await this.testModel.findOne({ where: { id: testId, userId } });

        if (!test) {
            throw new NotFoundException('Không tìm thấy đề thi');
        }

        const deleted = await this.answerModel.destroy({
            where: { testId, itemId }
        });

        if (deleted === 0) {
            throw new NotFoundException('Câu hỏi không có trong đề thi');
        }

        // Cập nhật số lượng câu hỏi
        const totalAnswers = await this.answerModel.count({ where: { testId } });
        await test.update({ quantities: totalAnswers });

        return {
            message: 'Xóa câu hỏi khỏi đề thi thành công',
            data: {
                totalQuestions: totalAnswers
            }
        };
    }

    async getTestQuestions(testId: number, userId: number) {
        const test = await this.testModel.findOne({
            where: { id: testId, userId },
            include: [{
                model: Answer,
                include: [Item]
            }]
        });

        if (!test) {
            throw new NotFoundException('Không tìm thấy đề thi');
        }

        return {
            message: 'Lấy danh sách câu hỏi trong đề thi thành công',
            data: test
        };
    }
}
