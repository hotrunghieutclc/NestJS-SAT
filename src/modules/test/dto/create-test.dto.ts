import { EnumRequired, NumberNotRequired, StringNotRequired } from "src/common/decorators";
import { Mode } from "src/models/test.model";

export class CreateTestDto {
    @EnumRequired(Mode, 'Chế độ')
    mode: Mode;

    @NumberNotRequired('Theta khởi tạo')
    thetaInit?: number;

    @NumberNotRequired('Số lượng câu hỏi')
    quantities?: number;
}
