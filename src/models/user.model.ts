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

    // Methods
    comparePassword(password: string) {
        const {password: passwordInDb} = this.get( {plain: true})
        return bcrypt.compare(password, passwordInDb);
    }

    getUserWithoutPassword() {
        const {password: _, ...rest } = this.get( {plain: true});
        return rest
    }

    @BeforeValidate
    static hashPassword(user: User) {
        if(user.isNewRecord) {
            const password = user.get('password');
            const hashedPassword = bcrypt.hashSync(password, 10);

            user.setDataValue('password', hashedPassword);
        }
    }
}
