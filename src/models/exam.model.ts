import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";
import { Question } from "./question.model";
import { ExamQuestion } from "./exam-question.model";

@Table
export class Exam extends Model<Exam> {
    @Column({
        allowNull: false,
        type: DataType.STRING,
    })
    title: string;

    @Column({
        allowNull: true,
        type: DataType.TEXT,
    })
    description: string;

    @Column({
        allowNull: false,
        type: DataType.INTEGER,
        defaultValue: 60,
    })
    duration: number; // Thời gian làm bài (phút)

    @Column({
        allowNull: false,
        type: DataType.BOOLEAN,
        defaultValue: true,
    })
    isActive: boolean;

    @Column({
        allowNull: true,
        type: DataType.STRING,
    })
    section: string; // Math, Reading, etc.

    @Column({
        allowNull: true,
        type: DataType.STRING,
    })
    difficulty: string; // Easy, Medium, Hard

    @ForeignKey(() => User)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    createdBy: number;

    @BelongsTo(() => User)
    creator: User;

    @BelongsToMany(() => Question, () => ExamQuestion)
    questions: Question[];

    @HasMany(() => ExamQuestion)
    examQuestions: ExamQuestion[];
}
