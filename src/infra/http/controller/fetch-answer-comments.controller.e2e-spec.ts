import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch answer comments (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AnswerCommentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)

    await app.init()
  })

  test('[GET] /answers/:answerId/comments', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    })

    await Promise.all([
      answerCommentFactory.makePrismaQuestionComment({
        content: 'Comment 1',
        authorId: user.id,
        answerId: answer.id,
      }),
      answerCommentFactory.makePrismaQuestionComment({
        content: 'Comment 2',
        authorId: user.id,
        answerId: answer.id,
      }),
      answerCommentFactory.makePrismaQuestionComment({
        content: 'Comment 3',
        authorId: user.id,
        answerId: answer.id,
      }),
    ])

    const accessToken = await jwt.signAsync({ sub: user.id.toValue() })

    const answerId = answer.id.toValue()

    const response = await request(app.getHttpServer())
      .get(`/answers/${answerId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({
          content: 'Comment 1',
          authorName: user.name,
        }),
        expect.objectContaining({
          content: 'Comment 2',
          authorName: user.name,
        }),
        expect.objectContaining({
          content: 'Comment 3',
          authorName: user.name,
        }),
      ]),
    })
  })
})
