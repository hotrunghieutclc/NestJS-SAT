import { ArrayNotRequired, BooleanNotRequired, DateNotRequired, NumberNotRequired, NumberRequired, ObjectNotRequired, StringNotRequired, StringRequired } from "src/common/decorators";
import { AIEvualuation, TestResponse } from "src/models";

export class AIEvualuationDto {
    @StringRequired('Thông điệp')
    evaluationText: string;
}

export class TestResponseDto {
    @NumberRequired('Mã câu hỏi')
    questionId: number

    @BooleanNotRequired()
    isCorrect: boolean;

    @StringRequired('Mã chọn')
    selectChoiceId: string;

    @DateNotRequired()
    responseTime?: Date

    @NumberNotRequired('')
    thetaAfter?: number
}

export class CreateTestDto {
    @NumberRequired('Nguời dùng')
    userId: number;

    @DateNotRequired()
    startedAt?: Date;

    @DateNotRequired()
    endedAt?: Date;

    @NumberNotRequired('Chỉ số')
    finalTheta?: number;

    @StringNotRequired()
    skill?: string;

    @ObjectNotRequired(AIEvualuationDto)
    aiEvualuation?: AIEvualuationDto;

    @ArrayNotRequired(TestResponseDto)
    testResponses?: TestResponseDto[]
}