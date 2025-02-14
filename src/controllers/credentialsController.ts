import { Request, Response } from "express";
import { BodyCredential } from "../protocols/authProtocol";
import credentialsServices from "../services/credentialsServices";
import httpStatus from "http-status";

async function createCredential(req: Request, res: Response) {
  const body = req.body as BodyCredential;
  const userId = res.locals.userId;
  await credentialsServices.createCredential(body, userId);
  res.sendStatus(httpStatus.CREATED);
}

async function getCredentials(req: Request, res: Response) {
  const userId: number = res.locals.userId;
  const credentials = await credentialsServices.getCredentials(userId);
  res.status(httpStatus.OK).send(credentials);
}

async function getCredentialById(req: Request, res: Response) {
  const userId: number = res.locals.userId;
  const { id } = req.params;
  const credential = await credentialsServices.getCredentialById(id, userId);
  res.status(httpStatus.OK).send(credential);
}

async function updateCredential(req: Request, res: Response) {
  const userId: number = res.locals.userId;
  const { id } = req.params;
  const body = req.body as BodyCredential;
  await credentialsServices.updateCredential(id, body, userId);
  res.sendStatus(httpStatus.NO_CONTENT);
}

async function deleteCredential(req: Request, res: Response) {
  const userId: number = res.locals.userId;
  const { id } = req.params;
  await credentialsServices.deleteCredential(id, userId);
  res.sendStatus(httpStatus.NO_CONTENT);
}

const credentialsController = {
  createCredential,
  getCredentials,
  getCredentialById,
  updateCredential,
  deleteCredential,
};

export default credentialsController;
