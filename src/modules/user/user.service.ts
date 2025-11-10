import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User, 
    ) {}

    async findByEmail(email: string) {
        return this.userModel.findOne({ where: {email}});
    }

    async findByUsername(username: string) {
        return this.userModel.findOne({ where: {username}});
    }

    async register(createUserDto: CreateUserDto) {
        const user = await this.findByEmail(createUserDto.email) || await this.findByUsername(createUserDto.username);

        if(user) {
            throw new BadRequestException('Email đã tồn tại')
        }

        const hashedPassword = bcrypt.hashSync(createUserDto.password, 10)
        const payload = {
            ...createUserDto,
            password: hashedPassword
        }

        await this.userModel.create(payload as any);

        return {
            message: 'Đăng ký thành công',
            data: payload
        }
    }

    async validateUser(email: string, password: string) {
        const user = await this.findByEmail(email);

        if(!user) {
            throw new BadRequestException('Email không tồn tại');
        }

        const isCorrectPassword = user.comparePassword(password);
        if(!isCorrectPassword) {
            throw new BadRequestException('Mật khẩu không chính xác.');
        }

        const { password: _, ...rest} = user;
        return user;
    }
}
