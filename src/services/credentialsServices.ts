import { BodyCredential } from "../protocols/authProtocol";
import Cryptr from "cryptr";
import { conflictError } from "../errors/conflictError";
import credentialsRepository from "../repositories/credentialsRepository";
import { notFoundError } from "../errors/notFoundError";
import { badRequestError } from "../errors/badRequestError";
import dotenv from "dotenv";
dotenv.config();

const cryptr = new Cryptr(process.env.CRYPTR_SECRET);

async function createCredential(body: BodyCredential, userId: number) {
  const existingCredential =
    await credentialsRepository.findCredentialByTitleAndId(body.title, userId);
  if (existingCredential) throw conflictError("Credential with the same title");

  const hashedPassword = cryptr.encrypt(body.password);

  await credentialsRepository.createCredential(body, userId, hashedPassword);
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

async function getCredentialById(id: string, user_id: number) {
  if (isNaN(Number(id))) throw badRequestError("Id");
  if (Number(id) <= 0) throw badRequestError("Id");

  const credential = await credentialsRepository.getCredentialById(
    Number(id),
    user_id
  );
  if (!credential) throw notFoundError("Credential");

  const decryptedCredential = {
    ...credential,
    password: cryptr.decrypt(credential.password),
  };

  return decryptedCredential;
}

async function updateCredential(
  id: string,
  body: BodyCredential,
  user_id: number
) {
  if (isNaN(Number(id))) throw badRequestError("Id");
  if (Number(id) <= 0) throw badRequestError("Id");

  const credential = await credentialsRepository.getCredentialById(
    Number(id),
    user_id
  );
  if (!credential) throw notFoundError("Credential");

  const hashedPassword = cryptr.encrypt(body.password);

  await credentialsRepository.updateCredential(
    Number(id),
    body,
    user_id,
    hashedPassword
  );
}

async function deleteCredential(id: string, user_id: number) {
  if (isNaN(Number(id))) throw badRequestError("Id");
  if (Number(id) <= 0) throw badRequestError("Id");

  const credential = await credentialsRepository.getCredentialById(
    Number(id),
    user_id
  );
  if (!credential) throw notFoundError("Credential");

  await credentialsRepository.deleteCredential(Number(id), user_id);
}

const credentialsServices = {
  createCredential,
  getCredentials,
  getCredentialById,
  updateCredential,
  deleteCredential,
};

export default credentialsServices;
