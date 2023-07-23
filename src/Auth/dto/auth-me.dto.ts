import { IsJWT } from 'class-validator';

export class AuthMetDTO {
  @IsJWT()
  token: string;
}
