const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  //few sample professors
  await prisma.professor.createMany({
    data: [
      {
        name: 'Dr. Alice Morgan',
        department: 'Computer Science',
        university: 'MIT',
        bio: 'Specializes in AI and machine learning.',
      },
      {
        name: 'Prof. James Carter',
        department: 'Mathematics',
        university: 'Stanford',
        bio: 'Expert in number theory and cryptography.',
      },
      {
        name: 'Dr. Priya Nair',
        department: 'Physics',
        university: 'IIT Delhi',
        bio: 'Quantum mechanics researcher.',
      },
    ],
  });

  console.log('✅ Seeded professors');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());