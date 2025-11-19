import { ArrayNotRequired, BooleanNotRequired, NumberRequired, StringNotRequired, StringRequired } from "src/common/decorators";

export class QuestionChoiceDto {
    @StringRequired('Nội dung câu trả lời')
    choiceText: string;

    @NumberRequired('Thứ tự câu trả lời')
    choiceOrder: number;

    @BooleanNotRequired()
    isCorrect: boolean;
}
export class CreateQuestionDto {
    @StringRequired('Nội dung câu hỏi')
    content: string;

    @NumberRequired('Mã câu hỏi')
    hashId: number;

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

    @ArrayNotRequired(QuestionChoiceDto)
    questionChoices?: QuestionChoiceDto[];
}