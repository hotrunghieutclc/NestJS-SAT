import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";
import { TestPaperItem } from "./test-paper-item.model";

@Table
export class TestPaper extends Model<TestPaper> {
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
        allowNull: true,
        type: DataType.INTEGER,
    })
    quantities: number;

    @ForeignKey(() => User)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @HasMany(() => TestPaperItem)
    items: TestPaperItem[];
}
