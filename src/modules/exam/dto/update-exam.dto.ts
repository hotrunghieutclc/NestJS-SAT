import { ArrayNotRequired, BooleanNotRequired, NumberNotRequired, StringNotRequired } from "src/common/decorators";
import { AddQuestionToExamDto } from "./create-exam.dto";

export class UpdateExamDto {
    @StringNotRequired()
    title?: string;

    @StringNotRequired()
    description?: string;

    @NumberNotRequired('Thời gian làm bài')
    duration?: number;

    @BooleanNotRequired()
    isActive?: boolean;

    @StringNotRequired()
    section?: string;

    @StringNotRequired()
    difficulty?: string;

    @ArrayNotRequired(AddQuestionToExamDto)
    questions?: AddQuestionToExamDto[];
}
