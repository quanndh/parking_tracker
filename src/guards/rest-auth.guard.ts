import { Injectable, Scope } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable({
  scope: Scope.REQUEST,
})
export class JwtAuthGuard extends AuthGuard('jwt') {}
