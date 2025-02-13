import express, { json, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

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


// Start server
const port: Number = Number(process.env.PORT) || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
