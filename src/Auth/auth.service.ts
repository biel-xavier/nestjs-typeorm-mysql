import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { users } from '@prisma/client';
import { PrismaService } from 'src/Prisma/prisma.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer/dist';

@Injectable()
export class AuthService {
    private audience = 'users';
    private issuer = 'login';
 
    constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailer: MailerService
  ) {}

  async createToken(user: users) {
    return {
            accessToken: this.jwtService.sign(
                {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                },
                {
                  expiresIn: '5 days',
                  subject: String(user.id),
                  issuer: this.issuer,
                  audience: this.audience
                },
              )
            }
  }
 
  async checkToken(token: string) {
    try {
        const data = this.jwtService.verify(token,  {
            audience: this.audience,
            issuer:  this.issuer

        });
        
        return data;    
    } catch (error) {
        throw new BadRequestException(error)
    } 
  }


  async isValidToken(token: string) {
    try {
        this.checkToken(token);
        return true;
    } catch (error) {
        return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        email
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email e/ou senha incorretos.');
    }


    if(!await bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException('Email e/ou senha incorretos.');
    }

    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email está incorreto.');
    }

    const token = this.jwtService.sign(
      {
        id: user.id
      },
      {
        expiresIn: '30 minutes',
        subject: String(user.id),
        issuer: 'forget',
        audience: 'users'
      },
    )

    await this.mailer.sendMail({
      subject: 'Recuperação de senha',
      to: 'gabriel.xavier@outlook.com',
      template: 'forget',
      context: {
        name: user.name,
        token
      }
    })
    return true;
  }

  async reset(password: string, token: string) {
    try {
      const data:any = this.jwtService.verify(token, 
        {
          issuer: 'forget',
          audience: 'users'

      }); 
      
      if(isNaN(Number(data.id))) {
        throw new BadRequestException('Token inválido.')
      }
      password = await bcrypt.hash(password, await bcrypt.genSalt());

      const user = await this.prisma.users.update({
        where: {
          id: Number(data.id),
        },
        data: {
          password,
        },
      });
      return this.createToken(user);
    } catch (error) {
        throw new BadRequestException(error)
    } 

    

    
    
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);
    return this.createToken(user);
  }
}
