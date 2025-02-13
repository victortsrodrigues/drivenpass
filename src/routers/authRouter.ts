import { Router } from "express";
import { validateSchema } from "../middlewares/schemaMiddleware";
import { signInSchema, signUpSchema } from "../schemas/bodySchemas";
import authController from "../controllers/authController";

const authRouter = Router();

authRouter.post("/sign-up", validateSchema(signUpSchema), authController.signUp);
authRouter.post("/sign-in", validateSchema(signInSchema), authController.signIn);

export default authRouter;