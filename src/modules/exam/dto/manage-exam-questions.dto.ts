import { ArrayRequired, NumberNotRequired, NumberRequired } from "src/common/decorators";

export class AddQuestionsDto {
    @NumberRequired('Mã câu hỏi')
    questionId: number;

    @NumberNotRequired('Thứ tự câu hỏi')
    questionOrder?: number;

    @NumberNotRequired('Điểm')
    point?: number;
}

export class AddQuestionsToExamDto {
    @ArrayRequired(AddQuestionsDto)
    questions: AddQuestionsDto[];
}

export class RemoveQuestionsFromExamDto {
    @ArrayRequired(Number)
    questionIds: number[];
}
