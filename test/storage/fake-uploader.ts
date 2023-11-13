import {
  Uploader,
  UploaderParams,
} from '@/domain/forum/application/storage/uploader'
import { randomUUID } from 'crypto'

interface Upload {
  fileName: string
  url: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  upload({ fileName }: UploaderParams): Promise<{ url: string }> {
    const url = randomUUID()

    this.uploads.push({ fileName, url })

    return Promise.resolve({ url })
  }
}
