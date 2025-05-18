import { Router } from "express";
import { validadeToken } from "../middlewares/authMiddleware";
import userController from "../controllers/userController";

const userRouter = Router();

userRouter.use(validadeToken);
userRouter.delete("/erase", userController.deleteAccount)

export default userRouter;