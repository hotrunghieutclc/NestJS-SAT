import { ConfigService } from "@nestjs/config"
import { SequelizeModuleOptions } from "@nestjs/sequelize"
import { Dialect } from "sequelize"
import { AIEvualuation, Cache, IRLParameter, Question, QuestionChoice, TestResponse, TestSession, User } from "src/models"
import { Test } from "src/models/test.model"
import { Answer } from "src/models/answer.model"
import { Item } from "src/models/item.model"
import { Passage } from "src/models/passage.model"
import { ItemSkillLink } from "src/models/item-skill-link.model"
import { IRLParam } from "src/models/irl-param.model"
import { Explanation } from "src/models/explaination.model"
import { Feedback } from "src/models/feeedback.model"
import { Skill } from "src/models/skill.model"

export const sequelizeConfig = (configService: ConfigService): SequelizeModuleOptions => ({
    database: configService.get<string>('DB_NAME'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT') ? Number(configService.get<number>('DB_PORT')) : 3306,
    dialect: configService.get<Dialect>('DB_DIALECT') ?? 'mysql',
    synchronize: true,
    autoLoadModels: true,
    logging: false,
    models: [
        AIEvualuation,
        Cache,
        IRLParameter,
        QuestionChoice,
        Question,
        TestResponse,
        TestSession,
        User,
        Test,
        Answer,
        Item,
        Passage,
        ItemSkillLink,
        IRLParam,
        Explanation,
        Feedback,
        Skill
    ]
})