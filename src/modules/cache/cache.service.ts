import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cache } from 'src/models';
import { CreateCacheDto } from './dto/create-cache.dto';
import { UpdateCacheDto } from './dto/update-cache.dto';

@Injectable()
export class CacheService {
    constructor(
        @InjectModel(Cache) private readonly cacheModel: typeof Cache
    ) {}

    async findByKey(key: string) {
        return this.cacheModel.findOne({ where: { key}})
    }

    async createCache(createCacheDto: CreateCacheDto) {
        const alreadyExists = await this.findByKey(createCacheDto.key);
        if(alreadyExists) {
            throw new BadRequestException('Khóa đã tồn tại')
        }
        await this.cacheModel.create(createCacheDto as any);
        return {
            message: 'Tạo cache thành công'
        }
    }

    async updateCache(updateCacheDto: UpdateCacheDto, id: number) {
        const alreadyExists = await this.cacheModel.findByPk(id);
        if(!alreadyExists) {
            throw new BadRequestException('Cache không tồn tại');
        }

        const updated = await alreadyExists.update(updateCacheDto);

        return {
            message: 'Cache đã được cập nhật',
            data: updated
        }
    }

    async findAll() {
        return await this.cacheModel.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })
    }

    async deleteCache(id: number) {
        await this.cacheModel.destroy({ where: { id }});
        return {
            message: 'Xoá cache thành công'
        }
    }

    async findById(id: number) {
        const alreadyExists = await this.cacheModel.findByPk(id);
        if(!alreadyExists) {
            throw new BadRequestException('Cache không tồn tại');
        }
        return await this.cacheModel.findByPk(id);
    }
}
