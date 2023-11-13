import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) throw new Error('Invalid comment type')

    return QuestionAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        questionId: new UniqueEntityID(raw.questionId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistenceUpdateMany(
    attachments: QuestionAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) =>
      attachment.attachmentId.toString(),
    )

    const questionId = attachments[0].questionId.toString()

    return {
      where: {
        id: { in: attachmentIds },
      },
      data: {
        questionId,
      },
    }
  }

  static toPersistenceDeleteMany(
    attachments: QuestionAttachment[],
  ): Prisma.AttachmentDeleteManyArgs {
    const attachmentIds = attachments.map((attachment) =>
      attachment.attachmentId.toString(),
    )

    return {
      where: {
        id: { in: attachmentIds },
      },
    }
  }
}
