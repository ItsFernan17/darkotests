import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from '../../common/enums/rol.enum';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from './roles.decorator';

export function Auth(...roles: Role[]) {
  return applyDecorators(Roles(roles), UseGuards(AuthGuard, RolesGuard));
}