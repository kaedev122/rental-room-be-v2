import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as _ from 'lodash';

import type { UserRoleEnum } from '../constants';
import type { UserEntity } from '@modules/user/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRoleEnum[]>(
      'role',
      context.getHandler(),
    );
    // If no roles are required, allow access
    if (_.isEmpty(requiredRoles)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = <UserEntity>request.user;

    // If no user is found, deny access
    if (!user) {
      return false;
    }
    
    // Check if the user's role is included in the required roles
    return requiredRoles.includes(user.role);
  }
}
