import { Column, DataType, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { IRLParameter } from "./irl-parameter.model";
import { TestResponse } from "./test-response.model";
import { QuestionChoice } from "./question-choice.model";

@Table
export class Question extends Model<Question> {
    @Column({
        allowNull: false,
        unique: true,
        type: DataType.INTEGER,
    })
    hashId: number;

    @Column({
        allowNull: false,
        type: DataType.TEXT,
    })
    content: string;

    @Column({
        allowNull: true,
        type: DataType.STRING,
    })
    section: string;

    @Column({
        allowNull: true,
        type: DataType.STRING,
    })
    skill: string;

    @Column({
        allowNull: true,
        type: DataType.TEXT,
    })
    passage: string;

    @Column({
        allowNull: true,
        type: DataType.STRING,
    })
    difficulty: string;

    @Column({
        allowNull: true,
        type: DataType.STRING,
    })
    model: string;

    @HasOne(() => IRLParameter)
    irlParameter: IRLParameter;

    @HasMany(() => TestResponse)
    testResponses: TestResponse[]; 
    
    @HasMany(() => QuestionChoice)
    questionChoices: QuestionChoice[];
}