import { Body, Controller, Post, Headers, UseGuards, Req, UseInterceptors, BadRequestException, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { AuthService } from './auth.service';
import { FilesInterceptor, FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';

import { UploadedFile, UploadedFiles} from '@nestjs/common/decorators'
import { FileService } from '../file/file.service';
import { User } from '../Decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../user/entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}

  @Post('login')
  async login(@Body() { email, password }: AuthLoginDTO) {
    return await this.authService.login(email, password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  @Post('forget')
  async forget(@Body() { email }: AuthForgetDTO) {
    return await this.authService.forget(email);
  }
  
  @Post('reset')
  async reset(@Body() { password, token }: AuthResetDTO) {
    return await this.authService.reset(password, token);
  }

  @UseGuards(AuthGuard)
  @Post('me')
  async me(@User()  user: UserEntity  ) {
    return user;
  }

  @UseInterceptors(FileInterceptor('files'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(
    @User() user, 
    @UploadedFile( new ParseFilePipe({
        validators:[
          new FileTypeValidator({fileType: 'image/PNG'}),
          new MaxFileSizeValidator({ maxSize: 1024 * 50})
        ]
      })) photo: Express.Multer.File 
    ) {
      const filename = `photo-${user.id}.png`;
      try {
      await this.fileService.upload(photo, filename);  
    } catch (error) {
      throw new BadRequestException(error)
    }
     
    
    
    return {sucess: true}
  }

  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard)
  @Post('files')
  async uploadFiles(@User() user, @UploadedFiles() files: Express.Multer.File[] ) {
    
    return {sucess: true}
  }

  
  @UseInterceptors(FileFieldsInterceptor([{
    name: 'photo',
    maxCount: 1
  }, {
    name: 'documents',
    maxCount: 10
  }]))
  @UseGuards(AuthGuard)
  @Post('files-fields')
  async uploadFilesFields(@User() user, @UploadedFiles() files: {photo: Express.Multer.File[], documents: Express.Multer.File[]} ) {
    
    return {sucess: true}
  }

  
}
