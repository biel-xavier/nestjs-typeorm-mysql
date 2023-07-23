import { Module, forwardRef } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { UserModule } from 'src/user/user.module'
import { PrismaModule } from 'src/Prisma/prisma.module'
import { AuthService } from './auth.service'
import { FileModule } from 'src/file/file.module'

@Module({
    imports: [
        JwtModule.register({
            secret: `$pZqD&S"29Y!K^m2Z'Q=Yt9vB\M,)hry`
        }),
        forwardRef(()=> UserModule),
        PrismaModule,
        FileModule
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {}