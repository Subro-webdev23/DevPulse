import type { NextFunction, Request, Response } from "express";

export const authorize = (...roles: string[]) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userRole = req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden access",
      });
    }

    next();
  };
};