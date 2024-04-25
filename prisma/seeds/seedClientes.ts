import { PrismaClient } from '@prisma/client';
import { fakerPT_BR as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  //seed para clientes usando o prisma e a lib faker
  for (let i = 0; i < 200; i++) {
    await prisma.cliente.create({
      data: {
        tenantId: '99dbe599-6fbc-4b98-8d9d-334028808527',
        nome: faker.person.firstName(),
        email: faker.internet.email(),
        cpf: '52647675058',
        telefone: faker.phone.number(),
        genero: ['M', 'F'][Math.floor(Math.random() * ['M', 'F'].length)],
        endereco: faker.location.street(),
        cidade: faker.location.city(),
        estado: faker.location.state(),
        cep: faker.location.zipCode(),
        dataNascimento: faker.date.past(),
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
