import "dotenv/config";
import jwt from "jsonwebtoken";
import { Request, Response } from 'express';

// Usage:
//   tsx src/scripts/generateTestToken.ts Lister
//   tsx src/scripts/generateTestToken.ts Seeker

const role = process.argv[2] || "Seeker";
const token = jwt.sign(
    { id: "test-user-id", role },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN as any }
);
console.log(`\nGenerated ${role} token:\n${token}\n`);
console.log(
    "In Postman/Thunder Client: Authorization tab -> Bearer Token -> paste this value."
);