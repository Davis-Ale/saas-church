import bcrypt from 'bcryptjs'
import slugify from 'slugify'
import { prisma } from '../src/db/prisma'

async function main() {
  const email = 'admin@igreja.com'
  const password = 'senha123'
  const churchName = 'Test Church'
  const churchSlug = slugify(churchName, { lower: true, strict: true })

  const hashedPassword = await bcrypt.hash(password, 10)

  const church = await prisma.church.upsert({
    where: {
      slug: churchSlug,
    },
    update: {
      name: churchName,
      country: 'BR',
      status: 'active',
    },
    create: {
      name: churchName,
      slug: churchSlug,
      country: 'BR',
      status: 'active',
    },
  })

  await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      password: hashedPassword,
      churchId: church.id,
      status: 'active',
    },
    create: {
      email,
      password: hashedPassword,
      churchId: church.id,
      status: 'active',
    },
  })

  console.log('Test user ready:')
  console.log('Email: admin@igreja.com')
  console.log('Password: senha123')
}

main()
  .catch((error) => {
    console.error(error)
  })
  .finally(() => prisma.$disconnect())
