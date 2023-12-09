import { RequestHandler } from "express";
import { connectDB } from "../config/database";
import { Profile, User } from "../entity";
import { ErrorHandler, SECRET_KEY } from "../helpers";

const createProfile: RequestHandler = async (req, res, next) => {
  try {
    const {id } = req.params;

    const userExists = await connectDB.getRepository(User).findOne({
      where: { id },
    });

    if (!userExists) {
      throw new ErrorHandler(400, "User not found");
    }

    if (!Object.keys(req.body)) {
        throw new ErrorHandler(400, "Fill in all required data")
    }

    const profile = await connectDB.getRepository(Profile).save(req.body);

    if (!profile) {
      throw new ErrorHandler(400, "Error in creating user");
    }

    return res.status(201).json({
      success: true,
      message: "Profile creation successful",
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

export default { createProfile };
