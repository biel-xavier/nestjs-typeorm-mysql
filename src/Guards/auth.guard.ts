import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/Auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
    ) {}
  async canActivate(context: ExecutionContext) {
    
    
    const request = context.switchToHttp().getRequest().headers;
    const headers = request.headers;
    try {
        const data = await this.authService.checkToken((headers.authorization ?? '').split(' ')[1]);
        request.tokenPayload = data;

        request.user = await this.userService.readOne(data.id);
        
        return true;
    } catch (error) {
        return false;
    }
    
    return true;
  }
}
