import { BeforeValidate, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Analytic } from "./analytic.model";
import { Item } from "./item.model";
import { Test } from "./test.model";
import { Feedback } from "./feeedback.model";
import * as bcrypt from 'bcryptjs'

export enum Role {
    R1 = 'admin',
    R2 = 'teacher',
    R3 = 'student'
}

@Table
export class User extends Model<User> {
    @Column({
        allowNull: false,
        unique: true,
        type: DataType.STRING
    })
    email: string;

    @Column({
        allowNull: false,
        type: DataType.STRING
    })
    password: string;

    @Column({
        allowNull: false,
        type: DataType.STRING
    })
    fullName: string;

    @Column({
        defaultValue: Role.R3,
        type: DataType.ENUM(...Object.values(Role))
    })
    role: Role;

    // Relationships
    @HasMany(() => Analytic)
    analytics: Analytic[];

    @HasMany(() => Item)
    items: Item[];

    @HasMany(() => Test)
    tests: Test[];

    @HasMany(() => Feedback)
    feedbacks: Feedback[];

    // Methods
    comparePassword(password: string) {
        const {password: passwordInDb} = this.get( {plain: true});
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