import { Body, Controller, Post, Headers, UseGuards, Req, UseInterceptors, BadRequestException, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthMetDTO } from './dto/auth-me.dto';
import { AuthGuard } from 'src/Guards/auth.guard';
import { User } from 'src/Decorators/user.decorator';
import { FilesInterceptor, FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { writeFile } from 'fs/promises';
import {join} from 'path';
import { FileService } from 'src/file/file.service';

import { UploadedFile, UploadedFiles} from '@nestjs/common/decorators'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
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
  async me(@User() user ) {
    return {user}
  }

  @UseInterceptors(FileInterceptor('files'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(@
      User() user, 
      @UploadedFile( new ParseFilePipe({
        validators:[
          new FileTypeValidator({fileType: 'image/PNG'}),
          new MaxFileSizeValidator({ maxSize: 1024 * 50})
        ]
      })) photo: Express.Multer.File 
    ) {
    const path = join(__dirname, '..', '..', 'storage', 'photos', `photo-${user.id}.png`);
    try {
      await this.fileService.upload(photo, path);  
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
