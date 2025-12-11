import { ConfigService } from "@nestjs/config"
import { SequelizeModuleOptions } from "@nestjs/sequelize"
import { Dialect } from "sequelize"
import { AIEvualuation, Cache, Exam, Item, ItemSkillLink, ExamQuestion, IRLParameter, Question, QuestionChoice, TestResponse, TestSession, TestPaper, TestPaperItem, User } from "src/models"

export const sequelizeConfig = (configService: ConfigService): SequelizeModuleOptions => {
    const rawDialect = configService.get<string>('DB_DIALECT') ?? 'mysql';
    const dialect = (rawDialect as string).toString().trim() as Dialect;

    const models = [
        AIEvualuation,
        Cache,
        Exam,
        ExamQuestion,
        IRLParameter,
        ItemSkillLink,
        Item,
        QuestionChoice,
        Question,
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