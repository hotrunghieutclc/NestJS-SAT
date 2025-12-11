import { BeforeValidate, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { TestSession } from "./test-session.model";
import * as bcrypt from 'bcryptjs';

@Table
export class User extends Model<User> {
    @Column({
        unique: true,
        type: DataType.STRING,
    })
    email: string;

    @Column({
        allowNull: false,
        unique: true,
        type: DataType.STRING,
    })
    username: string;

    @Column({
        allowNull: false,
        type: DataType.STRING,
    })
    password: string;

    @HasMany(() => TestSession)
    testSessions: TestSession[];

    comparePassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }
}