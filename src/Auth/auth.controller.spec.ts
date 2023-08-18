import { Test, TestingModule } from "@nestjs/testing"
import { AuthController } from "./auth.controller"
import { userServiceMock } from "../testing/user-service.mock"
import { AuthService } from "./auth.service"
import { FileService } from "../file/file.service"
import { UserService } from "../user/user.service"
import { AuthGuard } from "@nestjs/passport"
import { guardMock } from "../testing/guard.mock"
import { authServiceMock } from "../testing/auth-service.mock"
import { fileServiceMock } from "../testing/file-service.mock"
import { accessToken } from "../testing/access-token.mock"
import { authLoginDTO } from "../testing/auth-login-dto.mock"
import { authRegisterDTO } from "../testing/auth-register-dto.mock"
import { authForgetDTO } from "../testing/auth-forget-dto.mock"
import { authResetDTO } from "../testing/auth-reset-dto.mock"
import { userEntityList } from "../testing/user-entity-list.mock"
import { getPhoto } from "../testing/photo.mock"

describe('AuthController', () => {

    let authController: AuthController;
    let authService: AuthService;
    let fileService: FileService;
    
    beforeEach( async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [
                AuthController
            ],
            providers: [authServiceMock, fileServiceMock]
        })
        .overrideGuard(AuthGuard)
        .useValue(guardMock)
        .compile();
    
        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
        fileService = module.get<FileService>(FileService);
    })
    

    test('Validar a definição', () => {
        expect(authController).toBeDefined();
        expect(authService).toBeDefined();
        expect(fileService).toBeDefined();
    })

    describe('Fluxo de autenticação', () => {
        
        test('Method login', async () => {
        const result = await authController.login(authLoginDTO);
        expect(result).toEqual({accessToken});
        })

        test('Method register', async () => {
        const result = await authController.register(authRegisterDTO);
        expect(result).toEqual({accessToken});
        })

        test('Method forget', async () => {
        const result = await authController.forget(authForgetDTO);
        expect(result).toEqual(true);
        })

        test('Method reset', async () => {
        const result = await authController.reset(authResetDTO);
        expect(result).toEqual({accessToken});
        })
        
    })

    describe('Rotas autenticadas',  () => {
        test('Method me', async () => {
            const result = await authController.me(userEntityList[0]);
            expect(result).toEqual(userEntityList[0]);
        })


        test('Method uploadPhoto', async () => {
            const photo = await getPhoto();
            const result = await authController.uploadPhoto(userEntityList[0], photo);
            expect(result).toEqual({sucess: true});
        })

    })



})