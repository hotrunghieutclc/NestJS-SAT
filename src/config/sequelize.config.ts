import { ConfigService } from "@nestjs/config"
import { SequelizeModuleOptions } from "@nestjs/sequelize"
import { Dialect } from "sequelize"
import { AIEvualuation, Cache, IRLParameter, Question, QuestionChoice, TestResponse, TestSession, User } from "src/models"

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
    ];
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