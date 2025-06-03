import {
  applyDecorators,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { type UserRoleEnum } from '../constants';
import { AuthGuard, RoleGuard } from '../guards';
import { AuthUserInterceptor } from '../interceptors';

export function Auth(
  role: UserRoleEnum[] = [],
): MethodDecorator {

  return applyDecorators(
    SetMetadata('role', role),
    UseGuards(AuthGuard(), RoleGuard),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}