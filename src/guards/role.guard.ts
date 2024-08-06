
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { Role } from '../enums/role.enum';

interface RequestWithUser extends Request {
    user?: any; // Replace `any` with the actual user type if available
  }


const RoleGuard = (roles: Role[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      return roles.includes(user?.role);
    }
  }
 
  return mixin(RoleGuardMixin);
}
 
export default RoleGuard;