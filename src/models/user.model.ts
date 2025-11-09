import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { TestSession } from "./test-session.model";

@Table
export class User extends Model<User> {
    @Column({
        allowNull: false,
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
}