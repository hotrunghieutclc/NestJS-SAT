import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CreateCacheDto } from './dto/create-cache.dto';
import { UpdateCacheDto } from './dto/update-cache.dto';

@Controller('cache')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Post('create')
  async createCache(@Body() createCacheDto: CreateCacheDto) {
    return this.cacheService.createCache(createCacheDto)
  }

  @Patch('update/:id')
  async updateCache(@Body() updateCacheDto: UpdateCacheDto, @Param('id', ParseIntPipe) id: number) {
    return this.cacheService.updateCache(updateCacheDto, id);
  }

  @Get('all')
  async findAll(@Req() req: any) {
    return await this.cacheService.findAll();
  }

  @Get('one/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.cacheService.findById(id);
  }

  @Delete('delete/:id')
  async deleteCache(@Param('id', ParseIntPipe) id: number) {
    return await this.cacheService.deleteCache(id);
  }
}