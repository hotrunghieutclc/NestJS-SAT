import { NumberNotRequired, StringNotRequired } from "src/common/decorators";

export class FilterQuestionDto {
    @StringNotRequired()
    search?: string;

    @NumberNotRequired('Số trang')
    page?: number;

    @NumberNotRequired("Giới hạn")
    limit?: number;

    @StringNotRequired()
    sortBy?: string;

    @StringNotRequired()
    sortOrder?: string;
}