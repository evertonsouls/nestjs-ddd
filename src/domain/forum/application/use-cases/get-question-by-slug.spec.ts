import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { makeAttachment } from 'test/factories/make-attachment'
import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionAttachment } from 'test/factories/make-question-attachments'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const student = makeStudent()
    inMemoryStudentsRepository.items.push(student)

    const attachment1 = makeAttachment()
    const attachment2 = makeAttachment()

    inMemoryAttachmentsRepository.items.push(attachment1)
    inMemoryAttachmentsRepository.items.push(attachment2)

    const newQuestion = makeQuestion({
      slug: Slug.create('example-question'),
      authorId: student.id,
    })

    await inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: attachment1.id,
      }),
    )
    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: attachment2.id,
      }),
    )

    const result = await sut.execute({
      slug: 'example-question',
    })

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
        author: student.name,
        attachments: [
          expect.objectContaining({
            title: attachment1.title,
            url: attachment1.url,
          }),
          expect.objectContaining({
            title: attachment2.title,
            url: attachment2.url,
          }),
        ],
      }),
    })
  })
})
