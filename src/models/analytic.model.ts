import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";
import { Skill } from "./skill.model";

@Table
export class Analytic extends Model<Analytic> {
    @Column({
        defaultValue: 0,
        type: DataType.FLOAT
    })
    accuracy: number;
    
    @Column({
        defaultValue: 0,
        type: DataType.FLOAT
    })
    avgTime: number;

    @Column({
        defaultValue: 0,
        type: DataType.INTEGER
    })
    attempts: number;

    @ForeignKey(() => User)
    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    userId: number;

    @ForeignKey(() => Skill)
    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    skillId: number;

    // Relationship
    @ForeignKey(() => Skill)
    skill: Skill;
}