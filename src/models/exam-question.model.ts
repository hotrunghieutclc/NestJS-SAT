import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Exam } from "./exam.model";
import { Question } from "./question.model";

@Table
export class ExamQuestion extends Model<ExamQuestion> {
    @ForeignKey(() => Exam)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    examId: number;

    @ForeignKey(() => Question)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    questionId: number;

    @Column({
        allowNull: false,
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    questionOrder: number; // Thứ tự câu hỏi trong đề

    @Column({
        allowNull: false,
        type: DataType.FLOAT,
        defaultValue: 1,
    })
    point: number; // Điểm cho câu hỏi này

    @BelongsTo(() => Exam)
    exam: Exam;

    @BelongsTo(() => Question)
    question: Question;
}
