import { BooleanNotRequired, NumberNotRequired, NumberRequired, StringNotRequired, StringRequired } from "src/common/decorators";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateQuestionChoiceDto {
    @StringRequired('Nội dung lựa chọn')
    choiceText: string;

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: 'Đáp án đúng không được bỏ trống' })
    @IsBoolean({ message: 'Đáp án đúng phải là boolean' })
    isCorrect: boolean;

    @NumberRequired('Thứ tự lựa chọn')
    choiceOrder: number;
}

export class UpdateQuestionChoiceDto {
    @StringNotRequired()
    choiceText?: string;

    @BooleanNotRequired()
    isCorrect?: boolean;

    @NumberNotRequired('Thứ tự lựa chọn')
    choiceOrder?: number;
}
