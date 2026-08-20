import "dotenv/config";
import express from "express";
import dotenv from 'dotenv';
import { connectDB } from "./config/db";
import authRouter from './routes/authRouter';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/auth', authRouter);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is sailing at http://localhost:${port}`);
  });
}); 