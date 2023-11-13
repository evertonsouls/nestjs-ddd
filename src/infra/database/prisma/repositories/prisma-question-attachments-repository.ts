import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) return

    await this.prisma.attachment.updateMany(
      PrismaQuestionAttachmentMapper.toPersistenceUpdateMany(attachments),
    )
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) return

    await this.prisma.attachment.deleteMany(
      PrismaQuestionAttachmentMapper.toPersistenceDeleteMany(attachments),
    )
  }

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachments = await this.prisma.attachment.findMany({
      where: { questionId },
    })

    return questionAttachments.map(PrismaQuestionAttachmentMapper.toDomain)
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: { questionId },
    })
  }
}
