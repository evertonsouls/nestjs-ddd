import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { UserPayload } from '@/infra/auth/auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'

const editAnswerBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema)

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditAnswerBodySchema,
    @Param('id') answerId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { content, attachments } = body
    const userId = user.sub

    const result = await this.editAnswer.execute({
      answerId,
      content,
      authorId: userId,
      attachmentsIds: attachments,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
