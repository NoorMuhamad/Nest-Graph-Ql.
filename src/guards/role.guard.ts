import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { UserRole } from 'src/enums';

import { JwtAuthGuard } from './jwtAuth.guard';
import { GqlExecutionContext } from '@nestjs/graphql';

const RoleGuard = (roles: UserRole[]): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const ctx = GqlExecutionContext.create(context);
      const { user } = ctx.getContext().req;

      return roles.includes(user?.role);
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
