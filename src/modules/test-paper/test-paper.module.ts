import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { TestPaperController } from './test-paper.controller';
import { TestPaperService } from './test-paper.service';
import { TestPaper } from 'src/models/test-paper.model';
import { TestPaperItem } from 'src/models/test-paper-item.model';
import { Item } from 'src/models/item.model';

@Module({
  imports: [SequelizeModule.forFeature([TestPaper, TestPaperItem, Item]), AuthModule],
  controllers: [TestPaperController],
  providers: [TestPaperService],
  exports: [TestPaperService],
})
export class TestPaperModule {}
