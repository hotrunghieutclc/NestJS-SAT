import { NumberNotRequired, StringNotRequired } from "src/common/decorators";

export class FilterTestDto {
    @StringNotRequired()
    search?: string;

    @NumberNotRequired('')
    userId?: number;

    @NumberNotRequired('')
    page?: number;

    @NumberNotRequired('')
    limit?: number;

    @StringNotRequired()
    sortBy?: string;

    @StringNotRequired()
    sortOrder?: string;
}