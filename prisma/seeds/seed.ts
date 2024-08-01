import { Prisma, PrismaClient } from '@prisma/client';

let prisma = new PrismaClient();

const books = [
  {
    code: 'JK-45',
    title: 'Harry Potter',
    author: 'J.K Rowling',
    stock: 1,
  },
  {
    code: 'SHR-1',
    title: 'A Study in Scarlet',
    author: 'Arthur Conan Doyle',
    stock: 1,
  },
  {
    code: 'TW-11',
    title: 'Twilight',
    author: 'Stephenie Meyer',
    stock: 1,
  },
  {
    code: 'HOB-83',
    title: 'The Hobbit, or There and Back Again',
    author: 'J.R.R. Tolkien',
    stock: 1,
  },
  {
    code: 'NRN-7',
    title: 'The Lion, the Witch and the Wardrobe',
    author: 'C.S. Lewis',
    stock: 1,
  },
];

const users = [
  {
    code: 'M001',
    name: 'Angga',
  },
  {
    code: 'M002',
    name: 'Ferry',
  },
  {
    code: 'M003',
    name: 'Putri',
  },
];

const userCreateManyInput: Prisma.UserCreateManyInput[] = Array.from({
  length: users.length,
}).map((_, index) => ({
  code: users[index].code,
  name: users[index].name,
}));

const bookCreateManyInput: Prisma.BookCreateManyInput[] = Array.from({
  length: books.length,
}).map((_, index) => ({
  code: books[index].code,
  title: books[index].title,
  author: books[index].author,
  stock: books[index].stock,
}));

export async function seed() {
  console.log('🚀 ~ Seeding sedang berjalan...');
  // Seed to database
  try {
    await prisma.$transaction(
      async (tx) => {
        // await tx.file
        //   .createMany({
        //     data: logoBankCreateManyInput,
        //   })
        //   .catch((error) => {
        //     console.log(error, 'logoBank');
        //     throw error;
        //   });

        await tx.user
          .createMany({
            data: userCreateManyInput,
          })
          .catch((error) => {
            console.log(error, 'superUser');
            throw error;
          });

        await tx.book
          .createMany({
            data: bookCreateManyInput,
          })
          .catch((error) => {
            console.log(error, 'book');
            throw error;
          });

        console.log('🚀 ~ Seeding completed...');
      },

      {
        maxWait: 100000, // default: 2000
        timeout: 20000000, // default: 5000
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
      },
    );
  } catch (error) {
    console.error('Seeding error', error);
  } finally {
    await prisma.$disconnect();
  }
}
