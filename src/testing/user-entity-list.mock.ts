import { Role } from "../Enums/role.enum";
import { UserEntity } from "../user/entity/user.entity";

export const userEntityList: UserEntity[] = [
    {
        id: 1,
        email: 'gabriel@xavier.com.br',
        name: 'Gabriel Xavier',
        password: '$2b$10$t53kRV2dPlS/AtHaxEdDBuyF096h/e1AYzfIbBuiclaqi65t1yArq',
        role: Role.User,
        createdAt: new Date(),                
        updatedAt: new Date(),             

    },
    {
        id: 2,
        email: 'teste@xavier.com.br',
        name: 'Teste Xavier',
        password: '$2b$10$t53kRV2dPlS/AtHaxEdDBuyF096h/e1AYzfIbBuiclaqi65t1yArq',
        role: Role.User,
        createdAt: new Date(),                
        updatedAt: new Date(),             
    }
]