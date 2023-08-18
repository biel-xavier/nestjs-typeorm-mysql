import { Test, TestingModule } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { userRepositoryMock } from "../testing/user-repository.mock"
import { jwtServiceMock } from "../testing/jwt-service.mock";
import { userServiceMock } from "../testing/user-service.mock";
import { mailerServiceMock } from "../testing/mailer-service.mock";
import { userEntityList } from "../testing/user-entity-list.mock";
import { accessToken } from "../testing/access-token.mock";
import { jwtPayload } from "../testing/jwt-payload.mock";
import { resetToken } from "../testing/reset-token.mock";
import { authRegisterDTO } from "../testing/auth-register-dto.mock";

describe('AuthService', () => {


    let authService: AuthService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                userRepositoryMock,
                jwtServiceMock,
                userServiceMock,
                mailerServiceMock
            ]
        }).compile();

        authService = module.get<AuthService>(AuthService)
    })

    test('Validar a definição', () => {
        expect(authService).toBeDefined();
    })
    
    describe('Token', () => {
        test('Method createToken', async () => {
            
            const result = await authService.createToken(userEntityList[0]);

            expect(result).toEqual({
                accessToken
            })
        })

        test('Method checkToken', async () => {
            
            const result = await authService.checkToken(accessToken);

            expect(result).toEqual(jwtPayload)
        })
        
        
        test('Method isValidToken', async () => {
            
            const result = await authService.isValidToken(accessToken);

            expect(result).toEqual(true)
        })
    })
    describe('Authenticate', () => {
        test('Method login', async () => {
            
            const result = await authService.login('gabriel@xavier.com.br', '123456');

            expect(result).toEqual({accessToken})

        })

        test('Method forget', async () => {
            
            const result = await authService.forget('gabriel@xavier.com.br');

            expect(result).toEqual(true)
            
        })

        test('Method reset', async () => {
            
            const result = await authService.reset('123456', resetToken);

            expect(result).toEqual({accessToken})
            
        })
        
        test('Method register', async () => {
            
            const result = await authService.register(authRegisterDTO);

            expect(result).toEqual({accessToken})
            
        })
    })
})