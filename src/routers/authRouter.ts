import { Router } from "express";
import { validateSchema } from "../middlewares/schemaMiddleware";
import { signUpSchema } from "../schemas/bodySchemas";
import authController from "../controllers/authController";

const authRouter = Router();

authRouter.post("/sign-up", validateSchema(signUpSchema), authController.signUp);

export default authRouter;