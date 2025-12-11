import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Analytic } from "./analytic.model";
import { ItemSkillLink } from "./item-skill-link.model";

export enum Domain {
    MATH = 'math',
    READING = 'reading',
    WRITING = 'writing'
}

@Table
export class Skill extends Model<Skill> {
    @Column({
        allowNull: false,
        unique: true,
        type: DataType.STRING
    })
    code: string;

    @Column({
        allowNull: false,
        type: DataType.TEXT
    })
    description: string;

    @Column({
        allowNull: false,
        type: DataType.STRING
    })
    name: string;

    @Column({
        allowNull: false,
        type: DataType.ENUM(...Object.values(Domain))
    })
    domain: Domain;

    // Relationships
    @HasMany(() => Analytic)
    analytics: Analytic[];

    @HasMany(() => ItemSkillLink)
    itemSkills: ItemSkillLink[];
}