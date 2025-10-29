import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";
import { Passage } from "./passage.model";
import { ItemSkillLink } from "./item-skill-link.model";
import { IRLParam } from "./irl-param.model";
import { Explanation } from "./explaination.model";
import { Answer } from "./answer.model";
import { Feedback } from "./feeedback.model";

export enum Section {
    MATH = 'math',
    READING = 'reading',
    WRITING = 'writing'
}

export enum Type {
    MULTIPLECHOICE = 'multipleChoice',
    SHORTANSWER = 'shortAnswer',
    ESSAY = 'essay'
}

export enum Difficulty {
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard'
}

export enum Source {
    MANUAL = 'manual',
    AIGENERATED = 'AIGenerated',
    IMPORTED = 'imported',
    OFFICIAL = 'official'
}

export enum Status {
    DRAFT = 'draft',
    VERIFIED = 'verified',
    LIVE = 'live',
    RETIRED = 'retired'
}

@Table
export class Item extends Model<Item> {
    @Column({
        allowNull: false,
        type: DataType.TEXT
    })
    stem: string;

    @Column({
        allowNull: true,
        type: DataType.JSON
    })
    choices: any;

    @Column({
        allowNull: true,
        type: DataType.INTEGER
    })
    answerIdx: number

    @Column({
        allowNull: false,
        type: DataType.TEXT
    })
    solution: string;

    @Column({
        allowNull: false,
        type: DataType.ENUM(...Object.values(Section))
    })
    section: Section;

    @Column({
        allowNull: false,
        type: DataType.ENUM(...Object.values(Type))
    })
    type: Type;

    @Column({
        defaultValue: Difficulty.MEDIUM,
        type: DataType.ENUM(...Object.values(Difficulty))
    })
    difficulty: Type;

    @Column({
        defaultValue: Source.MANUAL,
        type: DataType.ENUM(...Object.values(Source))
    })
    source: Source;

    @Column({
        defaultValue: Status.DRAFT,
        type: DataType.ENUM(...Object.values(Status))
    })
    status: Status;

    @ForeignKey(() => User)
    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    userId: number;

    @ForeignKey(() => Passage)
    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    passageId: number;

    // Relationship
    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Passage)
    passage: Passage;

    @HasMany(() => ItemSkillLink)
    itemSkills: ItemSkillLink[];

    @HasMany(() => IRLParam)
    params: IRLParam[];

    @HasMany(() => Explanation)
    explainations: Explanation[];

    @HasMany(() => Answer)
    answers: Answer[];

    @HasMany(() => Feedback)
    feedbacks: Feedback[];
}