import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) throw new Error('Invalid comment type')

    return AnswerAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        answerId: new UniqueEntityID(raw.answerId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistenceUpdateMany(
    attachments: AnswerAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) =>
      attachment.attachmentId.toString(),
    )

    const answerId = attachments[0].answerId.toString()

    return {
      where: {
        id: { in: attachmentIds },
      },
      data: {
        answerId,
      },
    }
  }

  static toPersistenceDeleteMany(
    attachments: AnswerAttachment[],
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
