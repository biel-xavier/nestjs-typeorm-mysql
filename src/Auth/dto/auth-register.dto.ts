import { IsEmail, IsString, MinLength } from "class-validator";
import { CreateUserDTO } from "../../user/dto/create-user.dto";

export class AuthRegisterDTO extends CreateUserDTO{
}