import { ArrayNotRequired, ArrayRequired, BooleanNotRequired, NumberNotRequired, NumberRequired, StringNotRequired, StringRequired } from "src/common/decorators";

export class AddQuestionToExamDto {
    @NumberRequired('Mã câu hỏi')
    questionId: number;

    @NumberNotRequired('Thứ tự câu hỏi')
    questionOrder?: number;

    @NumberNotRequired('Điểm')
    point?: number;
}

export class CreateExamDto {
    @StringRequired('Tiêu đề đề thi')
    title: string;

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

    @NumberRequired('Người tạo')
    createdBy: number;

    @ArrayNotRequired(AddQuestionToExamDto)
    questions?: AddQuestionToExamDto[];
}
