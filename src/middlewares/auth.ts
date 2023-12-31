import { RequestHandler } from "express";
import { verify } from "jsonwebtoken";
import { ErrorHandler, SECRET_KEY } from "../helpers";
import { connectDB } from "../config";
import { User } from "../entity";

interface IDecode {
  _id: string;
}

const verifyToken: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      throw new ErrorHandler(401, "A token is required for authentication");
    }

    const _token = token.replace("Bearer ", "");
    const decoded = verify(
      _token,
      SECRET_KEY || ("secretKey" as string)
    ) as IDecode;

    const user = await connectDB
      .getRepository(User)
      .findOne({ where: { id: decoded._id }, relations: ["profile"] });

      console.log("user", user)

    if (!user) {
      throw new ErrorHandler(400, "Invalid token");
    }

    res.locals.user = user;
  } catch (err) {
    next(err);
  }

  next();
};
export { verifyToken };
