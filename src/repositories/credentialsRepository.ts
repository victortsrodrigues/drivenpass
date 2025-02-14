import { BodyCredential } from "../protocols/authProtocol";
import prisma from "../database/database";

async function findCredentialByTitleAndId(title: string, userId: number) {
  return await prisma.credential.findFirst({
    where: {
      title: title,
      user_id: userId
    }
  });
}

async function createCredential(body: BodyCredential, userId: number, hashedPassword: string) {
  const { title, url, username } = body;
  return await prisma.credential.create({
    data: {
      title: title,
      url: url,
      username: username,
      password: hashedPassword,
      user_id: userId
    }
  });
}

const credentialsRepository = {
  findCredentialByTitleAndId,
  createCredential
};

export default credentialsRepository;