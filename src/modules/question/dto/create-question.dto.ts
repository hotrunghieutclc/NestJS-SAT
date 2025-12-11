import { NumberNotRequired, StringNotRequired, StringRequired } from "src/common/decorators";

export class CreateQuestionDto {
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
}
