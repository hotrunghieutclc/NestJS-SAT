import { StringRequired } from "src/common/decorators";

export class CreateUserDto {
   @StringRequired('Tên')
   fullName: string;
   
   @StringRequired('Email')
   email: string;

   @StringRequired('Mật khẩu')
   password: string;
}