import { AuthRegisterDTO } from "../Auth/dto/auth-register.dto";
import { Role } from "../Enums/role.enum";

export const authRegisterDTO:AuthRegisterDTO = {
    email: 'gabriel@xavier.com.br',
    name: 'Gabriel Xavier',
    password: '$2b$10$t53kRV2dPlS/AtHaxEdDBuyF096h/e1AYzfIbBuiclaqi65t1yArq',
    role: Role.User,
}