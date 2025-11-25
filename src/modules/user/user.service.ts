import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User, 
        private readonly jwtService: JwtService
    ) {}

    async findByEmail(email: string) {
        return this.userModel.findOne({ where: {email}});
    }

    async findByUsername(username: string) {
        return this.userModel.findOne({ where: {username}});
    }

    async findById(id: number) {
        return this.userModel.findOne({ where: {id}});
    }

    async register(createUserDto: CreateUserDto) {
        const user = await this.findByEmail(createUserDto.email) || await this.findByUsername(createUserDto.username);

        if(user) {
            throw new BadRequestException('Email đã tồn tại')
        }

        await this.userModel.create(createUserDto as any);

        return {
            message: 'Đăng ký thành công',
        }
    }

    async validateUser(email: string, password: string) {
        const user = await this.findByEmail(email);

        if(!user) {
            throw new BadRequestException('Tài khoản chưa được đăng ký.');
        }

        const isCorrectPassword = user.comparePassword(password);
        if(!isCorrectPassword) {
            throw new BadRequestException('Mật khẩu không chính xác.');
        }
        return user;
    }
}
