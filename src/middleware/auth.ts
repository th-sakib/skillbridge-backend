import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { userStatus } from "../../generated/prisma/enums";

export enum UserRole {
  admin = "ADMIN",
  tutor = "TUTOR",
  student = "STUDENT",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await betterAuth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "You're not authenticated.",
      });
    }

    if (session.user.status === userStatus.BANNED) {
      return res.status(400).json({
        success: false,
        message: "You are banned.",
      });
    }

    if (!session?.user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Email is not verified",
      });
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      emailVerified: session.user.emailVerified,
      role: session.user.role.trim(),
    };

    if (roles.length && !roles.includes(req.user.role as UserRole)) {
      return res.status(403).json({
        success: false,
        message: "access denied. You don't have proper permission.",
      });
    }

    next();
  };
};

export default auth;
