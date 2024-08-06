import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RequestWithUser } from 'src/interfaces/user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
  
    const cookie = request.cookies['jwt'];
  
    const data = await this.authService.validateToken(cookie);

    request.user = data;

    return true;
  }
}
