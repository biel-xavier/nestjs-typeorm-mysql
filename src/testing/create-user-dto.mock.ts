import { Role } from "../Enums/role.enum";
import { CreateUserDTO } from "../user/dto/create-user.dto";

export const createUserDTO:CreateUserDTO = {
    email: 'gabriel@xavier.com.br',
    name: 'Gabriel Xavier',
    password: '123456',
    role: Role.User          
}