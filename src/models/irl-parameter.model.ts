import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Question } from "./question.model";

@Table
export class IRLParameter extends Model<IRLParameter> {
    @Column({
        allowNull: false,
        type: DataType.FLOAT
    })
    a: number;

    @Column({
        allowNull: false,
        type: DataType.FLOAT
    })
    b: number;

    @Column({
        allowNull: false,
        type: DataType.FLOAT
    })
    c: number;

    @ForeignKey(() => Question)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    questionId: number;

    @BelongsTo(() => Question)
    question: Question;
}