import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { FilterQuestionDto } from './dto/filter-question.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('create')
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return await this.questionService.createQuestion(createQuestionDto);
  }

  @Get('all')
  async getAllQuestions(@Query() filterQuestionDto: FilterQuestionDto) {
    return await this.questionService.findAllQuestions(filterQuestionDto);
  }

  @Get('one/:id')
  async getQuestionById(@Param('id') id: number) {
    return await this.questionService.findQuestionById(id);
  }

  @Delete('delete/:id')
  async deleteQuestion(@Param('id') id: number) {
    return await this.questionService.delete(id);
  }
}
