import { AttachmentRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'

export class InMemoryAttachmentRepository implements AttachmentRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment): Promise<void> {
    this.items.push(attachment)
  }
}
