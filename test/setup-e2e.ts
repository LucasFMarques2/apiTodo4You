import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { randomUUID } from 'crypto'
import 'dotenv/config'

const prisma = new PrismaClient()

function generateUniqueDatabaseURL(schemaID: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'Por favor envie o providencie a variavel de ambiete da DATABASE_URL ',
    )
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaID)

  return url.toString()
}

const schemaID = randomUUID()

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaID)

  process.env.DATABASE_URL = databaseURL

  execSync('npx prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaID}" CASCADE`)
  await prisma.$disconnect()
})
