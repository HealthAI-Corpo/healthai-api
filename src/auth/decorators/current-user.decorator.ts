import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ZitadelJwtPayload } from '../jwt.strategy';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): ZitadelJwtPayload => {
    const request = context
      .switchToHttp()
      .getRequest<{ user: ZitadelJwtPayload }>();
    return request.user;
  },
);
