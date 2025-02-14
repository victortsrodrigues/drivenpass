import { BodyCredential } from "../protocols/authProtocol";
import Cryptr from "cryptr";
import { conflictError } from "../errors/conflictError";
import credentialsRepository from "../repositories/credentialsRepository";
import { notFoundError } from "../errors/notFoundError";
import { badRequestError } from "../errors/badRequestError";

const cryptr = new Cryptr("myTotallySecretKey");

async function createCredential(body: BodyCredential, userId: number) {
  const existingCredential =
    await credentialsRepository.findCredentialByTitleAndId(body.title, userId);
  if (existingCredential) throw conflictError("Credential with the same title");

  const hashedPassword = cryptr.encrypt(body.password);

  const credential = await credentialsRepository.createCredential(
    body,
    userId,
    hashedPassword
  );
  
  return credential;
}

async function getCredentials(user_id: number) {
  const credentials = await credentialsRepository.getCredentials(user_id);
  const decryptedCredentials = credentials.map((credential) => {
    return {
      ...credential,
      password: cryptr.decrypt(credential.password),
    };
  });

  return decryptedCredentials;
}

async function getCredentialsById(id: string, user_id: number) {
  if (isNaN(Number(id))) throw badRequestError("Id");
  if (Number(id) <= 0) throw badRequestError("Id");

  const credential = await credentialsRepository.getCredentialsById(Number(id), user_id);
  if (!credential) throw notFoundError("Credential");
  
  const decryptedCredential = {
    ...credential,
    password: cryptr.decrypt(credential.password),
  };

  return decryptedCredential;
}

const credentialsServices = {
  createCredential,
  getCredentials,
  getCredentialsById,
};

export default credentialsServices;
