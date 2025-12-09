import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { TestPaperService } from './test-paper.service';
import { CreateTestPaperDto } from './dto/create-test-paper.dto';
import { UpdateTestPaperDto } from './dto/update-test-paper.dto';
import { AddItemsDto } from './dto/add-items.dto';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('test-papers')
export class TestPaperController {
  constructor(private readonly service: TestPaperService) {}

  @Post()
  create(@Body() dto: CreateTestPaperDto, @Req() req: any) {
    const user = req.user;
    return this.service.create(dto, user.id);
  }

  @Get()
  findAll(@Req() req: any) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    return this.service.findAll({ page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTestPaperDto, @Req() req: any) {
    const user = req.user;
    return this.service.update(Number(id), dto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    return this.service.remove(Number(id), user);
  }

  @Post(':id/items')
  addItems(@Param('id') id: string, @Body() dto: AddItemsDto, @Req() req: any) {
    const user = req.user;
    return this.service.addItems(Number(id), dto, user);
  }

  @Delete(':id/items/:itemId')
  async removeItem(@Param('id') id: string, @Param('itemId') itemId: string, @Req() req: any) {
    const user = req.user;
    return this.service.removeItem(Number(id), Number(itemId), user);
  }
}
