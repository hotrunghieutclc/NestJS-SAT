import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { IRLParameter, Question, QuestionChoice } from "src/models";
import { AuthModule } from "../auth/auth.module";
import { QuestionController } from "./question.controller";
import { QuestionService } from "./question.service";

@Module({
    imports: [
        SequelizeModule.forFeature([Question, QuestionChoice, IRLParameter]),
        AuthModule
    ],
    controllers: [QuestionController],
    providers: [QuestionService],
    exports: [QuestionService]
})
export class QuestionModule {}
