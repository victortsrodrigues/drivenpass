import express, { json, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import "express-async-errors";
import errorHandler from "./middlewares/errorHandlerMiddleware";
import authRouter from "./routers/authRouter";
import credentialsRouter from "./routers/credentialsRouter";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(json());

// Health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("I'm OK");
});

// Routes
app.use(authRouter);
app.use(credentialsRouter);
app.use(errorHandler);

// Start server
const port: Number = Number(process.env.PORT) || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
