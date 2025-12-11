import { NumberNotRequired, StringNotRequired } from "src/common/decorators";

export class UpdateQuestionDto {
    @StringNotRequired()
    content?: string;

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
