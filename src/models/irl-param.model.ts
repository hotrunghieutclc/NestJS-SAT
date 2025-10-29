import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Item } from "./item.model";

@Table
export class IRLParam extends Model<IRLParam> {
    @Column({
        allowNull: false,
        type: DataType.FLOAT
    })
    discriminationValue: number;

    @Column({
        allowNull: false,
        type: DataType.FLOAT
    })
    difficultyValue: number;

    @Column({
        allowNull: false,
        type: DataType.FLOAT
    })
    guessingValue: number;

    @Column({
        allowNull: true,
        type: DataType.FLOAT
    })
    infoValue: number;

    @ForeignKey(() => Item)
    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    itemId: number;

    // Relationship
    @ForeignKey(() => Item)
    item: Item;

}