import { UserService } from "../user/user.service";
import { userEntityList } from "./user-entity-list.mock";


export const userServiceMock = {
    provide: UserService,
    useValue: {
        exist: jest.fn().mockResolvedValue(userEntityList[0]),
        create: jest.fn().mockResolvedValue(userEntityList[0]),
        save: jest.fn().mockResolvedValue(userEntityList[0]),
        read: jest.fn().mockResolvedValue(userEntityList),
        readOne: jest.fn().mockResolvedValue(userEntityList[0]),
        update: jest.fn().mockResolvedValue(userEntityList[0]),
        updatePartial: jest.fn().mockResolvedValue(userEntityList[0]),
        delete: jest.fn().mockResolvedValue(true)  
    }
}