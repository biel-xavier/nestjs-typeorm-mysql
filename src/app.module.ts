import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './Auth/auth.module';
import { ThrottlerModule, ThrottlerGuard   } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';


@Module({
  imports: [
    ThrottlerModule.forRoot({
        ttl: 60,
      limit: 10,
    }),
    forwardRef(()=> UserModule), 
    forwardRef(()=> AuthModule),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'kirstin.tromp@ethereal.email',
            pass: 'HR9UsK2NJ1RTY4trNv'
        }
      },
      defaults: {
        from: '"nest-cursojs" <kirstin.tromp@ethereal.email>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  
  
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
  exports: []
})
export class AppModule {}
