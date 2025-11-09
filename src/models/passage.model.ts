import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Item } from "./item.model";

@Table
export class Passage extends Model<Passage> {
    @Column({
        allowNull: false,
        type: DataType.STRING
    })
    title: string;

    @Column({
        allowNull: false,
        type: DataType.TEXT
    })
    content: string;

    @Column({
        allowNull: false,
        type: DataType.STRING
    })
    genre: string;

    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    wordCount: number;

    // Relationships
    @HasMany(() => Item)
    items: Item;
}