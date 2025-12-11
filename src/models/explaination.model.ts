import { Column, DataType, Model, Table, ForeignKey } from "sequelize-typescript";
import { Item } from "./item.model";

export enum Source {
    MANUAL = 'manual',
    AIVERIFIED = 'AIVerified',
    AIUNVERIFIED = 'AIUnverified',
}

@Table
export class Explanation extends Model<Explanation> {
    @Column({
        allowNull: false,
        type: DataType.TEXT
    })
    shortRationale: string;

    @Column({
        allowNull: false,
        type: DataType.TEXT
    })
    longSolution: string;


    @Column({
        defaultValue: false,
        type: DataType.BOOLEAN
    })
    toolChecked: boolean;

    @Column({
        defaultValue: Source.MANUAL,
        type: DataType.ENUM(...Object.values(Source))
    })
    source: Source;

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