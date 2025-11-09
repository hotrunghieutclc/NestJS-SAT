import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table
export class Cache extends Model<Cache> {
    @Column({
        allowNull: false,
        unique: true,
        type: DataType.STRING
    })
    key: string;

    @Column({
        allowNull: false,
        unique: true,
        type: DataType.STRING
    })
    model: string;

    @Column({
        allowNull: true,
        type: DataType.INTEGER
    })
    token: number;

    @Column({
        allowNull: true,
        type: DataType.INTEGER
    })
    response: number;
}