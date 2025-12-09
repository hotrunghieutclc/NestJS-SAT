import { ConfigService } from "@nestjs/config"
import { SequelizeModuleOptions } from "@nestjs/sequelize"
import { Dialect } from "sequelize"
import { AIEvualuation } from 'src/models/ai-evaluation.model';
import { Analytic } from 'src/models/analytic.model';
import { Answer } from 'src/models/answer.model';
import { Cache } from 'src/models/cache.model';
import { Explanation } from 'src/models/explaination.model';
import { Feedback } from 'src/models/feeedback.model';
import { IRLParam } from 'src/models/irl-param.model';
import { IRLParameter } from 'src/models/irl-parameter.model';
import { ItemSkillLink } from 'src/models/item-skill-link.model';
import { Item } from 'src/models/item.model';
import { Passage } from 'src/models/passage.model';
import { Question } from 'src/models/question.model';
import { QuestionChoice } from 'src/models/question-choice.model';
import { Skill } from 'src/models/skill.model';
import { TestResponse } from 'src/models/test-response.model';
import { TestSession } from 'src/models/test-session.model';
import { User } from 'src/models/user.model';
import { TestPaper } from 'src/models/test-paper.model';
import { TestPaperItem } from 'src/models/test-paper-item.model';
import { Test } from 'src/models/test.model';

export const sequelizeConfig = (configService: ConfigService): SequelizeModuleOptions => {
    const rawDialect = configService.get<string>('DB_DIALECT') ?? 'mysql';
    const dialect = (rawDialect as string).toString().trim() as Dialect;

    const models = [
        AIEvualuation,
        Analytic,
        Answer,
        Cache,
        Explanation,
        Feedback,
        IRLParam,
        IRLParameter,
        ItemSkillLink,
        Item,
        Passage,
        QuestionChoice,
        Question,
        Skill,
        Test,
        TestResponse,
        TestSession,
        User,
        TestPaper,
        TestPaperItem,
    ];

    if (dialect === 'sqlite') {
        const storage = configService.get<string>('DB_STORAGE') ?? configService.get<string>('DB_NAME') ?? './data/dev.sqlite';
        return {
            dialect: 'sqlite',
            storage,
            synchronize: true,
            autoLoadModels: true,
            logging: false,
            models,
        } as SequelizeModuleOptions;
    }

    return {
        database: configService.get<string>('DB_NAME'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT') ? Number(configService.get<number>('DB_PORT')) : 3306,
        dialect,
        synchronize: true,
        autoLoadModels: true,
        logging: false,
        models,
    } as SequelizeModuleOptions;
}