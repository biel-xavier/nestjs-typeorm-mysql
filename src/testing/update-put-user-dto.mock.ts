import { Role } from "../Enums/role.enum";
import { UpdatePutUserDTO } from "../user/dto/update-put-user.dto";

export const updatePutUserDTO:UpdatePutUserDTO = {
    email: 'gabriel@xavier.com.br',
    name: 'Gabriel Xavier',
    password: '123456',
    role: Role.User          
}