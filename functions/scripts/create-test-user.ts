import { prisma } from '../src/db/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('senha123', 10);
  
  const church = await prisma.church.findFirst();
  
  if (!church) {
    console.log('No church found. Creating one...');
    const newChurch = await prisma.church.create({
      data: {
        name: 'Test Church',
        country: 'BR',
        status: 'active'
      }
    });
    
    const user = await prisma.user.create({
      data: {
        email: 'admin@igreja.com',
        password: hashedPassword,
        churchId: newChurch.id,
        status: 'active'
      }
    });
    
    console.log('Created church and user:');
    console.log('Email: admin@igreja.com');
    console.log('Password: senha123');
  } else {
    const user = await prisma.user.create({
      data: {
        email: 'admin@igreja.com',
        password: hashedPassword,
        churchId: church.id,
        status: 'active'
      }
    });
    
    console.log('User created:');
    console.log('Email: admin@igreja.com');
    console.log('Password: senha123');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
