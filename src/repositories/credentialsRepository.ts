import { BodyCredential } from "../protocols/authProtocol";
import prisma from "../database/database";

async function findCredentialByTitleAndId(title: string, userId: number) {
  return await prisma.credential.findFirst({
    where: {
      title: title,
      user_id: userId,
    },
  });
}

async function createCredential(
  body: BodyCredential,
  userId: number,
  hashedPassword: string
) {
  const { title, url, username } = body;
  return await prisma.credential.create({
    data: {
      title: title,
      url: url,
      username: username,
      password: hashedPassword,
      user_id: userId,
    },
  });
}

async function getCredentials(user_id: number) {
  return await prisma.credential.findMany({
    where: {
      user_id: user_id,
    },
  });
}

async function getCredentialsById(id: number, user_id: number) {
  return await prisma.credential.findFirst({
    where: {
      id: id,
      user_id: user_id,
    },
  });
}

const credentialsRepository = {
  findCredentialByTitleAndId,
  createCredential,
  getCredentials,
  getCredentialsById,
};

export default credentialsRepository;
