import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { TestSession } from "./test-session.model";
import { Question } from "./question.model";

@Table
export class TestResponse  extends Model<TestResponse> {
    @Column({
        allowNull: false,
        type: DataType.BOOLEAN
    })
    isCorrect: boolean;
    
    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW
    })
    responseTime: Date;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    selectChoiceId: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: true
    })
    thetaAfter: number;

    @ForeignKey(() => TestSession)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    sessionId: number;

    @ForeignKey(() => Question)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    questionId: number;

    @BelongsTo(() => TestSession)      
    testSession: TestSession;

    @BelongsTo(() => Question)      
    question: Question;
}