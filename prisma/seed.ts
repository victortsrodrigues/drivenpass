import prisma from "../src/database/database";
import bcrypt from "bcrypt";

async function getOrCreateDemo() {
  const name = "Demo";
  const email = "demo@driven.com.br";
  const password = "demo123";

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: name,
      email: email,
      password: bcrypt.hashSync(password, 10),
    },
  });
}

getOrCreateDemo()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
