import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { TestSession } from "./test-session.model";

@Table
export class AIEvualuation extends Model<AIEvualuation> {
    @Column({
        allowNull: false,
        type: DataType.TEXT
    })
    evaluationText: string;

    @ForeignKey(() => TestSession)
    @Column({
        allowNull: true,
        type: DataType.INTEGER,
    })
    sessionId: number;

    @Column({
        allowNull: true,
        type: DataType.STRING,
    })
    model: string;

    @Column({
        allowNull: true,
        type: DataType.STRING,
    })
    prompt: string;

    @Column({
        allowNull: true,
        type: DataType.INTEGER,
    })
    token: string;

    @BelongsTo(() => TestSession)
    testSession: TestSession;
}