import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { TestPaper } from "./test-paper.model";
import { Item } from "./item.model";

@Table
export class TestPaperItem extends Model<TestPaperItem> {
    @ForeignKey(() => TestPaper)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    testPaperId: number;

    @ForeignKey(() => Item)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    itemId: number;

    @Column({
        allowNull: true,
        type: DataType.INTEGER,
    })
    position: number;

    @Column({
        allowNull: true,
        type: DataType.JSON,
    })
    metadata: any;

    @BelongsTo(() => TestPaper)
    testPaper: TestPaper;

    @BelongsTo(() => Item)
    item: Item;
}
