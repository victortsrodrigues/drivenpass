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

async function getCredentialById(id: number, user_id: number) {
  return await prisma.credential.findFirst({
    where: {
      id: id,
      user_id: user_id,
    },
  });
}

async function updateCredential(
  id: number,
  body: BodyCredential,
  user_id: number,
  hashedPassword: string
) {
  const { title, url, username } = body;
  return await prisma.credential.update({
    where: {
      id: id,
      user_id: user_id,
    },
    data: {
      title: title,
      url: url,
      username: username,
      password: hashedPassword,
    },
  });
}

async function deleteCredential(id: number, user_id: number) {
  return await prisma.credential.delete({
    where: {
      id: id,
      user_id: user_id,
    },
  });
}

async function deleteAllCredentials(user_id: number) {
  return await prisma.credential.deleteMany({
    where: {
      user_id: user_id,
    },
  });
}

const credentialsRepository = {
  findCredentialByTitleAndId,
  createCredential,
  getCredentials,
  getCredentialById,
  updateCredential,
  deleteCredential,
  deleteAllCredentials,
};

export default credentialsRepository;
