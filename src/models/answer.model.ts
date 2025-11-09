import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Test } from "./test.model";
import { Item } from "./item.model";

@Table
export class Answer extends Model<Answer> {
    @Column({
        allowNull: true,
        type: DataType.INTEGER
    })
    content: number;

    @Column({
        allowNull: true,
        type: DataType.STRING
    })
    shortText: string;

    @Column({
        defaultValue: false,
        type: DataType.BOOLEAN
    })
    isCorrect: boolean;

    @Column({
        allowNull: true,
        type: DataType.INTEGER
    })
    timeSpent: number;

    @Column({
        allowNull: true,
        type: DataType.FLOAT
    })
    thetaBefore: number;

    @Column({
        allowNull: true,
        type: DataType.FLOAT
    })
    thetaAfter: number;

    @Column({
        allowNull: false,
        type: DataType.DATE
    })
    answeresAt: any;

    @ForeignKey(() => Test)
    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    testId: number;

    @ForeignKey(() => Item)
    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    itemId: number;

    // Relationship
    @BelongsTo(() => Test)
    test: Test;

    @BelongsTo(() => Item)
    item: Item;
}