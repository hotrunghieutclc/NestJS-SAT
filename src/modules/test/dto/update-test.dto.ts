import { EnumRequired, NumberNotRequired, StringNotRequired } from "src/common/decorators";
import { Mode } from "src/models/test.model";
import { IsOptional, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTestDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsEnum(Mode)
    mode?: Mode;

    @NumberNotRequired('Theta khởi tạo')
    thetaInit?: number;

    @NumberNotRequired('Theta cuối')
    thetaFinal?: number;

    @NumberNotRequired('SE cuối')
    seFinal?: number;

    @NumberNotRequired('Điểm quy đổi')
    scaledScore?: number;

    @NumberNotRequired('Số lượng câu hỏi')
    quantities?: number;
}
