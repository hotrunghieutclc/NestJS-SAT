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

    comparePassword(password: string) {
        try {
            const { password: passwordInDb } = this.get({ plain: true }) as any;
            return bcrypt.compareSync(password, passwordInDb as string);
        } catch (e) {
            // fallback to raw field
            try {
                return bcrypt.compareSync(password, this.password as string);
            } catch (_) {
                return false;
            }
        }
    }

    @BeforeValidate
    static hashPassword(user: User) {
        if (user.isNewRecord) {
            const raw = (user.get('password') as any) || '';
            if (raw) {
                const hashedPassword = bcrypt.hashSync(raw, 10);
                user.setDataValue('password', hashedPassword);
            }
        }
    }
}