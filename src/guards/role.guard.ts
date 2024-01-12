import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { UserRole } from 'src/enums';

import RequestWithUser from 'src/modules/auth/interface/roleBase.interface';
import { JwtAuthGuard } from './jwtAuth.guard';

const RoleGuard = (role: UserRole): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest<RequestWithUser>();
      console.log(request);
      const user = request.user;

      return user?.role.includes(role);
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
