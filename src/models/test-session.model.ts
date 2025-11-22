import { BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";
import { AIEvualuation } from "./ai-evaluation.model";
import { TestResponse } from "./test-response.model";

@Table
export class TestSession extends Model<TestSession>{
    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW
    })
    startedAt: Date;
    
    @Column({
        allowNull: true,
        type: DataType.DATE,
    })
    endedAt: Date;

    @Column({
        allowNull: true,
        type: DataType.FLOAT,
    })
    finalTheta: number;

    @Column({
        allowNull: true,
        type: DataType.STRING,
    })
    skill: string;

    @ForeignKey(() => User)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @HasOne(() => AIEvualuation)
    aiEvaluation: AIEvualuation;

    @HasMany(() => TestResponse)
    testResponses: TestResponse[];
}