import { StringRequired } from "src/common/decorators";

export class LoginDto {

    @StringRequired('Email')
    email: string;

    @StringRequired('Mật khẩu')
    password: string;
}