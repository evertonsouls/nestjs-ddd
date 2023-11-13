import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserPayload } from './auth.guard'

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest()

    return req.user as UserPayload
  },
)
