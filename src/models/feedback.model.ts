import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";
import { Item } from "./item.model";

@Table
export class Feedback extends Model<Feedback> {
    @Column({
        allowNull: false,
        type: DataType.TEXT
    })
    comment: string;

    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    rating: number;

    @ForeignKey(() => User)
    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    userId: number;

    @ForeignKey(() => Item)
    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    itemId: number;

    // Relationship
    @ForeignKey(() => User)
    user: User;

    @ForeignKey(() => Item)
    item: Item;
}