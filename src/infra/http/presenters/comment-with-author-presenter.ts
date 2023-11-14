import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class CommentWithAuthorPresenter {
  static toHTTP(comment: CommentWithAuthor) {
    return {
      id: comment.commentId.toString(),
      authorId: comment.authorId.toString(),
      authorName: comment.author,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}
