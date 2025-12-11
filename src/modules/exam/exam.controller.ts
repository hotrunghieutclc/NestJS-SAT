import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { FilterExamDto } from './dto/filter-exam.dto';
import { AddQuestionsToExamDto, RemoveQuestionsFromExamDto } from './dto/manage-exam-questions.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('exam')
@UseGuards(JwtGuard)
export class ExamController {
    constructor(private readonly examService: ExamService) { }

    // Tạo đề thi mới
    @Post('create')
    async createExam(@Body() createExamDto: CreateExamDto) {
        return await this.examService.createExam(createExamDto);
    }

    // Lấy danh sách đề thi
    @Get('all')
    async getAllExams(@Query() filterExamDto: FilterExamDto) {
        return await this.examService.findAllExams(filterExamDto);
    }

    // Lấy chi tiết đề thi
    @Get('one/:id')
    async getExamById(@Param('id') id: number) {
        return await this.examService.findExamById(id);
    }

    // Cập nhật đề thi
    @Put('update/:id')
    async updateExam(@Param('id') id: number, @Body() updateExamDto: UpdateExamDto) {
        return await this.examService.updateExam(id, updateExamDto);
    }

    // Xóa đề thi
    @Delete('delete/:id')
    async deleteExam(@Param('id') id: number) {
        return await this.examService.deleteExam(id);
    }

    // Lấy danh sách câu hỏi trong đề
    @Get(':examId/questions')
    async getExamQuestions(@Param('examId') examId: number) {
        return await this.examService.getExamQuestions(examId);
    }

    // Thêm câu hỏi vào đề thi
    @Post(':examId/questions/add')
    async addQuestionsToExam(
        @Param('examId') examId: number,
        @Body() addQuestionsDto: AddQuestionsToExamDto
    ) {
        return await this.examService.addQuestionsToExam(examId, addQuestionsDto);
    }

    // Xóa câu hỏi khỏi đề thi
    @Delete(':examId/questions/remove')
    async removeQuestionsFromExam(
        @Param('examId') examId: number,
        @Body() removeQuestionsDto: RemoveQuestionsFromExamDto
    ) {
        return await this.examService.removeQuestionsFromExam(examId, removeQuestionsDto);
    }

    // Cập nhật thông tin câu hỏi trong đề (thứ tự, điểm)
    @Patch(':examId/questions/:questionId')
    async updateExamQuestion(
        @Param('examId') examId: number,
        @Param('questionId') questionId: number,
        @Body() data: { questionOrder?: number; point?: number }
    ) {
        return await this.examService.updateExamQuestion(examId, questionId, data);
    }
}
