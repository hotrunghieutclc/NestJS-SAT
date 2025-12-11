import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { AddQuestionsToTestDto } from './dto/add-questions-to-test.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentInfo } from 'src/common/decorators';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Tests')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('tests')
export class TestController {
    constructor(private readonly testService: TestService) {}

    @Post()
    @ApiOperation({ summary: 'Tạo đề thi mới' })
    create(@CurrentInfo() user: any, @Body() createTestDto: CreateTestDto) {
        return this.testService.create(user.uid, createTestDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách đề thi' })
    findAll(@CurrentInfo() user: any) {
        return this.testService.findAll(user.uid);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Lấy chi tiết đề thi' })
    findOne(@Param('id', ParseIntPipe) id: number, @CurrentInfo() user: any) {
        return this.testService.findOne(id, user.uid);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Cập nhật đề thi' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @CurrentInfo() user: any,
        @Body() updateTestDto: UpdateTestDto
    ) {
        return this.testService.update(id, user.uid, updateTestDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Xóa đề thi' })
    delete(@Param('id', ParseIntPipe) id: number, @CurrentInfo() user: any) {
        return this.testService.delete(id, user.uid);
    }

    @Post(':id/questions')
    @ApiOperation({ summary: 'Thêm câu hỏi vào đề thi' })
    addQuestions(
        @Param('id', ParseIntPipe) id: number,
        @CurrentInfo() user: any,
        @Body() addQuestionsDto: AddQuestionsToTestDto
    ) {
        return this.testService.addQuestionsToTest(id, user.uid, addQuestionsDto);
    }

    @Delete(':id/questions/:itemId')
    @ApiOperation({ summary: 'Xóa câu hỏi khỏi đề thi' })
    removeQuestion(
        @Param('id', ParseIntPipe) id: number,
        @Param('itemId', ParseIntPipe) itemId: number,
        @CurrentInfo() user: any
    ) {
        return this.testService.removeQuestionFromTest(id, user.uid, itemId);
    }

    @Get(':id/questions')
    @ApiOperation({ summary: 'Lấy danh sách câu hỏi trong đề thi' })
    getQuestions(@Param('id', ParseIntPipe) id: number, @CurrentInfo() user: any) {
        return this.testService.getTestQuestions(id, user.uid);
    }
}
