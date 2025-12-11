import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateQuestionChoiceDto, UpdateQuestionChoiceDto } from './dto/question-choice.dto';
import { CreateQuestionWithChoicesDto } from './dto/create-question-with-choices.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Questions')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    // ==================== QUESTION ENDPOINTS ====================

    @Post('create')
    @ApiOperation({ summary: 'Tạo câu hỏi mới' })
    create(@Body() createQuestionDto: CreateQuestionDto) {
        return this.questionService.create(createQuestionDto);
    }

    @Post('with-choices')
    @ApiOperation({ summary: 'Tạo câu hỏi kèm lựa chọn' })
    createWithChoices(@Body() createDto: CreateQuestionWithChoicesDto) {
        return this.questionService.createWithChoices(createDto);
    }

    @Get('all')
    @ApiOperation({ summary: 'Lấy danh sách câu hỏi' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'section', required: false, type: String })
    @ApiQuery({ name: 'skill', required: false, type: String })
    @ApiQuery({ name: 'difficulty', required: false, type: String })
    findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('section') section?: string,
        @Query('skill') skill?: string,
        @Query('difficulty') difficulty?: string
    ) {
        return this.questionService.findAll(
            page ? Number(page) : 1,
            limit ? Number(limit) : 10,
            section,
            skill,
            difficulty
        );
    }

    @Get('one/:id')
    @ApiOperation({ summary: 'Lấy chi tiết câu hỏi' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.questionService.findOne(id);
    }

    @Patch('update/:id')
    @ApiOperation({ summary: 'Cập nhật câu hỏi' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateQuestionDto: UpdateQuestionDto) {
        return this.questionService.update(id, updateQuestionDto);
    }

    @Delete('delete/:id')
    @ApiOperation({ summary: 'Xóa câu hỏi' })
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.questionService.delete(id);
    }

    // ==================== QUESTION CHOICE ENDPOINTS ====================

    @Post('update/:id/choices')
    @ApiOperation({ summary: 'Thêm lựa chọn cho câu hỏi' })
    addChoice(
        @Param('id', ParseIntPipe) questionId: number,
        @Body() createChoiceDto: CreateQuestionChoiceDto
    ) {
        return this.questionService.addChoice(questionId, createChoiceDto);
    }

    @Get('one/:id/choices')
    @ApiOperation({ summary: 'Lấy danh sách lựa chọn của câu hỏi' })
    getChoices(@Param('id', ParseIntPipe) questionId: number) {
        return this.questionService.getChoices(questionId);
    }

    @Patch('update/:id/choices/:choiceId')
    @ApiOperation({ summary: 'Cập nhật lựa chọn' })
    updateChoice(
        @Param('id', ParseIntPipe) questionId: number,
        @Param('choiceId', ParseIntPipe) choiceId: number,
        @Body() updateChoiceDto: UpdateQuestionChoiceDto
    ) {
        return this.questionService.updateChoice(questionId, choiceId, updateChoiceDto);
    }

    @Delete('delete/:id/choices/:choiceId')
    @ApiOperation({ summary: 'Xóa lựa chọn' })
    deleteChoice(
        @Param('id', ParseIntPipe) questionId: number,
        @Param('choiceId', ParseIntPipe) choiceId: number
    ) {
        return this.questionService.deleteChoice(questionId, choiceId);
    }

    // ==================== IRL PARAMETER ENDPOINT ====================

    @Post(':id/irl-parameter')
    @ApiOperation({ summary: 'Cập nhật IRL parameter cho câu hỏi' })
    setIRLParameter(
        @Param('id', ParseIntPipe) questionId: number,
        @Body() body: { a: number; b: number; c: number }
    ) {
        return this.questionService.setIRLParameter(questionId, body.a, body.b, body.c);
    }
}
