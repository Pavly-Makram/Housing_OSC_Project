import { Request, Response, NextFunction } from "express";

export function authorize(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: "Not authenticated." });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                message: `Forbidden. This action requires role: ${allowedRoles.join(" or ")}`,
            });
            return;
        }
        next();
    };
}