import { NumberNotRequired, StringNotRequired, StringRequired } from "src/common/decorators";

export class CreateQuestionDto {
    @StringRequired('Nội dung câu hỏi')
    content: string;

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

    @NumberNotRequired('Hash ID')
    hashId?: number;
}
