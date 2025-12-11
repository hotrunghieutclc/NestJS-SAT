import { ArrayRequired, NumberNotRequired, StringNotRequired, StringRequired } from "src/common/decorators";
import { CreateQuestionChoiceDto } from "./question-choice.dto";

export class CreateQuestionWithChoicesDto {
    @StringRequired('Nội dung câu hỏi')
    content: string;

    @StringNotRequired()
    section?: string;

    @StringNotRequired()
    skill?: string;

    @StringNotRequired()
    passage?: string;

    @StringNotRequired()
    difficulty?: string;

    @StringNotRequired()
    model?: string;

    @NumberNotRequired('Hash ID')
    hashId?: number;

    @ArrayRequired(CreateQuestionChoiceDto)
    choices: CreateQuestionChoiceDto[];
}
