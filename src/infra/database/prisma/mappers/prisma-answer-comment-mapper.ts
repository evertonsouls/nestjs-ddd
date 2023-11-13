import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Prisma, Comment as PrismaComment } from '@prisma/client'

export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaComment): AnswerComment {
    if (!raw.answerId) throw new Error('Invalid comment type')

    return AnswerComment.create(
      {
        content: raw.content,
        answerId: new UniqueEntityID(raw.answerId),
        authorId: new UniqueEntityID(raw.authorId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistence(
    comment: AnswerComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: comment.id.toString(),
      content: comment.content,
      answerId: comment.answerId.toString(),
      authorId: comment.authorId.toString(),
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}
