import { NumberNotRequired, StringNotRequired } from "src/common/decorators";

export class FilterExamDto {
    @StringNotRequired()
    search?: string;

    @StringNotRequired()
    section?: string;

    @StringNotRequired()
    difficulty?: string;

    @StringNotRequired()
    sortBy?: string;

    @StringNotRequired()
    sortOrder?: 'ASC' | 'DESC';

    @NumberNotRequired('Trang')
    page?: number;

    @NumberNotRequired('Giới hạn')
    limit?: number;
}
