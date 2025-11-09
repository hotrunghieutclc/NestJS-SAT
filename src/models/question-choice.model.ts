import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Question } from "./question.model";

@Table
export class QuestionChoice extends Model<QuestionChoice>{
    @Column({
        allowNull: false,
        type: DataType.TEXT
    })
    choiceText: string;

    @Column({
        allowNull: false,
        type: DataType.BOOLEAN
    })
    isCorrect: boolean;

    @ForeignKey(() => Question)
    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    questionId: number;

    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    choiceOrder: number;

    @BelongsTo(() => Question)
    question: Question;
}