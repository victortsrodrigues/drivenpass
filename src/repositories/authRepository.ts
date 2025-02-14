import prisma from "../database/database";
import bcrypt from "bcrypt";

async function findByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

async function insertUser(name: string, email: string, password: string) {
  const saltRounds = 10;
  return await prisma.user.create({
    data: {
      name,
      email,
      password: bcrypt.hashSync(password, saltRounds),
    },
  });
}
const authRepository = {
  findByEmail,
  insertUser,
};

export default authRepository;
