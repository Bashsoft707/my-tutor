import { RequestHandler } from "express";
import { connectDB } from "../config/database";
import { Profile, User } from "../entity";
import { ErrorHandler, SECRET_KEY, generateLearningPath } from "../helpers";

const getLearningPath: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userProfile = await connectDB.getRepository(Profile).findOne({
      where: { id },
    });

    if (!userProfile) {
      throw new ErrorHandler(400, "Userprofile not found");
    }

    if (!Object.keys(req.body)) {
        throw new ErrorHandler(400, "Fill in all required data")
    }

    // const profile = await generateLearningPath(userProfile, "")

    return res.status(201).json({
      success: true,
      message: "Profile creation successful",
    });
  } catch (err) {
    next(err);
  }
};
