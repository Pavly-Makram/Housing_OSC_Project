import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: string;
    role: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export function protect(req: Request, res: Response, next: NextFunction): void {
    const token = req.cookies?.token;
    if (!token) {
        res.status(401).json({ message: "Not authenticated. No token provided." });
        return;
    }
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;
        req.user = { id: decoded.id, role: decoded.role };
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authenticated. Invalid or expired token." });
    }
}