import { Router } from "express";
import { validadeToken } from "../middlewares/authMiddleware";
import { validateSchema } from "../middlewares/schemaMiddleware";
import { credentialSchema } from "../schemas/bodySchemas";
import credentialsController from "../controllers/credentialsController";

const credentialsRouter = Router();

credentialsRouter.use(validadeToken);
credentialsRouter.post("/credentials", validateSchema(credentialSchema), credentialsController.createCredential);
credentialsRouter.get("/credentials", credentialsController.getCredentials);
credentialsRouter.get("/credentials/:id", credentialsController.getCredentialsById);

export default credentialsRouter;