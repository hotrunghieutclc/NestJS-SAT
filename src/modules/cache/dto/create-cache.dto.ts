import { NumberNotRequired, StringRequired } from "src/common/decorators";

export class CreateCacheDto {
    @StringRequired('Khóa')
    key: string;

    @StringRequired('Mẫu')
    model: string;

    @NumberNotRequired('Token')
    token?: number;

    @NumberNotRequired('Response')
    response?: number;
}