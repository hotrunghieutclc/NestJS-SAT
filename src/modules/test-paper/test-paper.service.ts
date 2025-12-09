import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TestPaper } from '../../models/test-paper.model';
import { TestPaperItem } from '../../models/test-paper-item.model';
import { Item } from '../../models/item.model';
import { CreateTestPaperDto } from './dto/create-test-paper.dto';
import { UpdateTestPaperDto } from './dto/update-test-paper.dto';
import { AddItemsDto } from './dto/add-items.dto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class TestPaperService {
  constructor(
    @InjectModel(TestPaper)
    private testPaperModel: typeof TestPaper,
    @InjectModel(TestPaperItem)
    private testPaperItemModel: typeof TestPaperItem,
    @InjectModel(Item)
    private itemModel: typeof Item,
    private sequelize: Sequelize,
  ) {}

  async create(createDto: CreateTestPaperDto, userId: number) {
    const paper = await this.testPaperModel.create({ ...createDto, userId } as any);
    return paper;
  }

  async findAll(opts: { page?: number; limit?: number }) {
    const page = opts.page && opts.page > 0 ? opts.page : 1;
    const limit = opts.limit && opts.limit > 0 ? opts.limit : 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.testPaperModel.findAndCountAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findOne(id: number) {
    const paper = await this.testPaperModel.findByPk(id, { include: [ { model: TestPaperItem, include: [Item] } ] });
    if (!paper) throw new NotFoundException('TestPaper not found');
    return paper;
  }

  async update(id: number, dto: UpdateTestPaperDto, user: any) {
    const paper = await this.testPaperModel.findByPk(id);
    if (!paper) throw new NotFoundException('TestPaper not found');

    // permission: owner or admin
    if (paper.userId !== user.id && user.role !== 'admin') {
      throw new NotFoundException('Bạn không có quyền sửa TestPaper này');
    }

    await paper.update(dto as any);
    return paper;
  }

  async remove(id: number, user: any) {
    const paper = await this.testPaperModel.findByPk(id);
    if (!paper) throw new NotFoundException('TestPaper not found');

    if (paper.userId !== user.id && user.role !== 'admin') {
      throw new NotFoundException('Bạn không có quyền xoá TestPaper này');
    }

    await paper.destroy();
    return { deleted: true };
  }

  async addItems(testPaperId: number, dto: AddItemsDto, user: any) {
    const paper = await this.testPaperModel.findByPk(testPaperId);
    if (!paper) throw new NotFoundException('TestPaper not found');

    if (paper.userId !== user.id && user.role !== 'admin') {
      throw new NotFoundException('Bạn không có quyền thêm câu hỏi vào TestPaper này');
    }

    const items = await this.itemModel.findAll({ where: { id: dto.itemIds } });
    if (items.length !== dto.itemIds.length) throw new NotFoundException('One or more Items not found');

    return this.sequelize.transaction(async (t) => {
      const created: TestPaperItem[] = [];
      for (let i = 0; i < dto.itemIds.length; i++) {
        const itemId = dto.itemIds[i];
        const pos = i + 1;
        const rec = await this.testPaperItemModel.create({ testPaperId, itemId, position: pos } as any, { transaction: t });
        created.push(rec);
      }
      return created;
    });
  }

  async removeItem(testPaperId: number, itemId: number, user: any) {
    const paper = await this.testPaperModel.findByPk(testPaperId);
    if (!paper) throw new NotFoundException('TestPaper not found');

    if (paper.userId !== user.id && user.role !== 'admin') {
      throw new NotFoundException('Bạn không có quyền xoá câu hỏi khỏi TestPaper này');
    }

    const rec = await this.testPaperItemModel.findOne({ where: { testPaperId, itemId } });
    if (!rec) throw new NotFoundException('Item not found in TestPaper');
    await rec.destroy();
    return { deleted: true };
  }
}
