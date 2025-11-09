import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { User } from "src/models";
import { UserService } from "src/modules/user/user.service";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            usernameField: "email"
        });
    }

    async validate(email: string, password: string): Promise<User> {
        const user = await this.userService.validateUser(email, password);
        return user; // Return cái gì -> passport sẽ gắn lên req.user 
    }
}