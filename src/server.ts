import "dotenv/config";
import express from "express";
import dotenv from 'dotenv';
import { connectDB } from "./config/db";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import cookieParser from "cookie-parser";
import authRouter from './routes/authRouter';
import listingRouter from './routes/listingRouter';
import requestRouter from './routes/requestRouter';

dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

app.use(express.json());
app.use(cookieParser());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRouter);
app.use('/api/listings', listingRouter);
app.use('/api/requests', requestRouter);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is sailing at http://localhost:${port}`);
  });
}); 