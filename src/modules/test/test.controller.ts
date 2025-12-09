import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { FilterTestDto } from './dto/filter-test.dto';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post('create')
  async create(@Body() createTestDto: CreateTestDto) {
    return await this.testService.create(createTestDto);
  }

  @Get('one/:id')
  async getTestInfo(@Param('id') id: number) {
    return await this.testService.findTestById(id);
  }

  @Get('all')
  async findAllTest(@Query() filterTestDto: FilterTestDto) {
    return await this.testService.findAll(filterTestDto);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    return await this.testService.remove(id);
  }
}
