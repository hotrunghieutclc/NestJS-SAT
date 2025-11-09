import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";
import { Answer } from "./answer.model";

export enum Mode {
    ADAPATIVE = 'adaptive',
    FIXED = 'fixed',
    DIAGNOSTIC = 'diagnostic'
}

@Table
export class Test extends Model<Test> {
    @Column({
        defaultValue: Mode.ADAPATIVE,
        type: DataType.ENUM(...Object.values(Mode))
    })
    mode: Mode;

    @Column({
        allowNull: true,
        type: DataType.FLOAT
    })
    thetaInit: number;

    @Column({
        allowNull: true,
        type: DataType.FLOAT
    })
    thetaFinal: number;

    @Column({
        allowNull: true,
        type: DataType.FLOAT
    })
    seFinal: number;

    @Column({
        allowNull: true,
        type: DataType.INTEGER
    })
    scaledScore: number;

    @Column({
        defaultValue: 0,
        type: DataType.INTEGER
    })
    quantities: number;

    @Column({
        allowNull: false,
        type: DataType.DATE
    })
    startedAt: any;

    @Column({
        allowNull: true,
        type: DataType.DATE
    })
    endedAt: any;

    @ForeignKey(() => User)
    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    userId: number;

    // Relationship
    @BelongsTo(() => User)
    user: User;

    @HasMany(() => Answer)
    answers: Answer[]
}