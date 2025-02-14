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
  console.log(credentials);
  res.status(httpStatus.OK).send(credentials);
}

async function getCredentialsById(req: Request, res: Response) {
  const userId: number = res.locals.userId;
  const { id } = req.params;
  const credential = await credentialsServices.getCredentialsById(id, userId);
  res.status(httpStatus.OK).send(credential);
}

const credentialsController = {
  createCredential,
  getCredentials,
  getCredentialsById,
};

export default credentialsController;
