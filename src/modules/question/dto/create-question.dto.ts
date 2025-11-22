import { ArrayNotRequired, BooleanNotRequired, NumberNotRequired, NumberRequired, StringNotRequired, StringRequired } from "src/common/decorators";

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

    @NumberNotRequired("Mã")
    hashId?: number;

    @StringRequired("Phạm vi")
    section: string;

    @StringRequired("Kỹ năng")
    skill: string;

    @StringNotRequired()
    passage?: string;

    @StringRequired("Độ khó")
    difficulty: string;

    @StringNotRequired()
    model?: string;

    @ArrayNotRequired(QuestionChoiceDto)
    questionChoices?: QuestionChoiceDto[];
}