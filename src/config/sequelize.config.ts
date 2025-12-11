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

export const sequelizeConfig = (configService: ConfigService): SequelizeModuleOptions => {
    const rawDialect = configService.get<string>('DB_DIALECT') ?? 'mysql';
    const dialect = (rawDialect as string).toString().trim() as Dialect;

    const models = [
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
