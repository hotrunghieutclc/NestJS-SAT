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
        allowNull: false,
        type: DataType.INTEGER,
    })
    sessionId: number;

    @BelongsTo(() => TestSession)
    testSession: TestSession;
}