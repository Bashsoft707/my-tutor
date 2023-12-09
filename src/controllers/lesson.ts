import { RequestHandler } from "express";
import { connectDB } from "../config/database";
import { Lesson } from "../entity";
import { ErrorHandler } from "../helpers";

const getAvailableLessons: RequestHandler = async (req, res, next) => {
  try {
    const lessons = await connectDB.getRepository(Lesson).find()

    if (lessons.length < 0) {
      throw new ErrorHandler(400, "No lessons found");
    }

    return res.status(201).json({
      success: true,
      message: "Retrieved lessons successfully",
      data: lessons,
    });
  } catch (err) {
    next(err);
  }
};

export default { getAvailableLessons };
