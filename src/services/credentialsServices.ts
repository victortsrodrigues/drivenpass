import prisma from "../database/database";
import { BodyCredential } from "../protocols/authProtocol";
import Cryptr from 'cryptr';
import { conflictError } from "../errors/conflictError";
import credentialsRepository from "../repositories/credentialsRepository";

const cryptr = new Cryptr('myTotallySecretKey');

async function createCredential(body: BodyCredential, userId: number) {
  const existingCredential = await credentialsRepository.findCredentialByTitleAndId(body.title, userId);
  if (existingCredential) throw conflictError("Credential with the same title");

  const hashedPassword = cryptr.encrypt(body.password);

  const credential = await credentialsRepository.createCredential(body, userId, hashedPassword);
  console.log(credential);
  return credential;
}

const credentialsServices = {
  createCredential,
};

export default credentialsServices;