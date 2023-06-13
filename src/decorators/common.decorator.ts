import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/guards/rest-auth.guard';

export interface AuthorizedRequest extends Request {
  user: any;
}

export const CurrentUser = createParamDecorator<
  keyof any,
  ExecutionContext,
  any
>((field, ctx) => {
  const request = ctx.switchToHttp().getRequest<AuthorizedRequest>();
  return request.user;
});

export const Authenticated = () => {
  return applyDecorators(UseGuards(JwtAuthGuard));
};
