import { ArrayRequired, NumberNotRequired, StringNotRequired, StringRequired } from "src/common/decorators";
import { CreateQuestionChoiceDto } from "./question-choice.dto";

export class CreateQuestionWithChoicesDto {
    @StringRequired('Nội dung câu hỏi')
    content: string;

    @StringRequired("Mục")
    section: string;

    @StringRequired("Kỹ năng")
    skill: string;

    @StringNotRequired()
    passage?: string;

    @StringRequired("Độ khó")
    difficulty: string;

    @StringNotRequired()
    model?: string;

    @NumberNotRequired('Hash ID')
    hashId?: number;

    @ArrayRequired(CreateQuestionChoiceDto)
    choices: CreateQuestionChoiceDto[];
}
