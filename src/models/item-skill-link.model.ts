import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Item } from "./item.model";
import { Skill } from "./skill.model";

@Table
export class ItemSkillLink extends Model<ItemSkillLink> {
    @Column({
        defaultValue: 1.0,
        type: DataType.FLOAT
    })
    weight: number

    @ForeignKey(() => Item)
    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    itemId: number;

    @ForeignKey(() => Skill)
    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    skillId: number;

    // Relationship
    @BelongsTo(() => Item)
    item: Item;

    @BelongsTo(() => Skill)
    skill: Skill;
}