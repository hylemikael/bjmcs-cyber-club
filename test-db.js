const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main() {
  const start = Date.now()
  const users = await prisma.student.count()
  console.log(`DB count: ${users} (took ${Date.now() - start}ms)`)
}
main().catch(console.error).finally(() => prisma.$disconnect())
