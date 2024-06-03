import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "../datasource";
import { Users } from "../entity/User";
import { JwtPayload } from "jsonwebtoken";

const userRepository = db.getRepository(Users);

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Authorization token not provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await userRepository.findOneBy({
      id: parseInt(decoded.id as string),
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    (req as any).user = user; // Attach user to request object

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token" });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    } else {
      console.error("Error verifying token:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};
