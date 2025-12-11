import { ArrayRequired } from "src/common/decorators";
import { ApiProperty } from "@nestjs/swagger";

export class AddQuestionsToTestDto {
    @ApiProperty({ 
        description: 'Danh sách ID của các item/câu hỏi cần thêm vào đề',
        type: [Number],
        example: [1, 2, 3]
    })
    @ArrayRequired(Number)
    questionIds: number[];
}
