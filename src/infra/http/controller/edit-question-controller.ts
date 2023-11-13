import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
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

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema)

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditQuestionBodySchema,
    @Param('id') questionId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content, attachments } = body
    const userId = user.sub

    const result = await this.editQuestion.execute({
      questionId,
      title,
      content,
      authorId: userId,
      attachmentsIds: attachments,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
