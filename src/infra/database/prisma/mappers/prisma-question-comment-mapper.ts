import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Prisma, Comment as PrismaComment } from '@prisma/client'

export class PrismaQuestionCommentMapper {
  static toDomain(raw: PrismaComment): QuestionComment {
    if (!raw.questionId) throw new Error('Invalid comment type')

    return QuestionComment.create(
      {
        content: raw.content,
        questionId: new UniqueEntityID(raw.questionId),
        authorId: new UniqueEntityID(raw.authorId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistence(
    comment: QuestionComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: comment.id.toString(),
      content: comment.content,
      questionId: comment.questionId.toString(),
      authorId: comment.authorId.toString(),
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}
