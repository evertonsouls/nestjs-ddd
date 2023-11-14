import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { UserPayload } from '@/infra/auth/auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'

@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('notificationId') notificationId: string,
    @CurrentUser() currentUser: UserPayload,
  ) {
    const result = await this.readNotification.execute({
      notificationId,
      recipientId: currentUser.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
