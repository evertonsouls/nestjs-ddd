import { config } from 'dotenv'

import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { randomUUID } from 'crypto'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const prisma = new PrismaClient()
const schemaId = randomUUID()

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId)

  process.env.DATABASE_URL = databaseURL

  execSync('pnpm prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  prisma.$disconnect()
})
