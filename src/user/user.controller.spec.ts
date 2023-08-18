import { Test, TestingModule } from "@nestjs/testing"
import { UserController } from "./user.controller"
import { userServiceMock } from "../testing/user-service.mock";
import { AuthGuard } from "../Guards/auth.guard";
import { guardMock } from "../testing/guard.mock";
import { RoleGuard } from "../Guards/role.guard";
import { UserService } from "./user.service";
import { createUserDTO } from "../testing/create-user-dto.mock";
import { userEntityList } from "../testing/user-entity-list.mock";
import { updatePutUserDTO } from "../testing/update-put-user-dto.mock";
import { updatePatchUserDTO } from "../testing/update-patch-user-dto.mock";

describe('UserController', () => {

    let userController: UserController;
    let userService: UserService;
    beforeEach( async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [
                UserController
            ],
            providers: [
                userServiceMock
            ]
        })
        .overrideGuard(AuthGuard)
        .useValue(guardMock)
        .overrideGuard(RoleGuard)
        .useValue(guardMock)
        .compile();

        userController = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);

    })

    test('Validar a definição', () => {
        expect(userController).toBeDefined();
        expect(userService).toBeDefined();
    })

    describe('Teste da aplicação dos Guards neste Controller', () => {
        test('Validar se os guards estão aplicados', async () => {
            const guards = Reflect.getMetadata('__guards__', UserController);
            expect(guards.length).toEqual(2);
            console.log(guards[0]);
            expect(new guards[0]()).toBeInstanceOf(RoleGuard);
            expect(new guards[1]()).toBeInstanceOf(AuthGuard);
        })
    })
    
    describe('Create', () => {
        test('Method create', async () => {
            const result = await userController.create(createUserDTO);
            expect(result).toEqual(userEntityList[0]);
        })
    })

    describe('Read', () => {
        test('Method read', async () => {
            const result = await userController.read();
            expect(result).toEqual(userEntityList);
        })

        test('Method readOne', async () => {
            const result = await userController.readOne(1);
            expect(result).toEqual(userEntityList[0]);
        })
    })

    describe('Update', () => {
        test('Method update', async () => {
            const result = await userController.update(updatePutUserDTO, 1);
            expect(result).toEqual(userEntityList[0]);
        })

        test('Method updatePartial', async () => {
            const result = await userController.updatePartial(updatePatchUserDTO, 1);
            expect(result).toEqual(userEntityList[0]);
        })
    })

    describe('Delete', () => {
        test('Method delete', async () => {
            const result = await userController.delete(1);
            expect(result).toEqual(true);
        })
    })

})