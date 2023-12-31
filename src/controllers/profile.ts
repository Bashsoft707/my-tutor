import { RequestHandler } from "express";
import { connectDB } from "../config/database";
import { Profile, User } from "../entity";
import { ErrorHandler } from "../helpers";

const createProfile: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    console.log("id", id)

    const userExists = await connectDB.getRepository(User).findOne({
      where: { id: undefined },
    });

    if (!userExists) {
      throw new ErrorHandler(400, "User not found");
    }

    console.log("user Exists", userExists, id)

    if (!Object.keys(req.body)) {
      throw new ErrorHandler(400, "Fill in all required data");
    }

    const profile = await connectDB
      .getRepository(Profile)
      .save({ ...req.body, user: userExists });

    if (!profile) {
      throw new ErrorHandler(400, "Error in creating user profile");
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

const getUserProfile: RequestHandler = async (req, res, next) => {
  try {
    const {user: {id}} = res.locals;

    const userExists = await connectDB.getRepository(User).findOne({
      where: { id },
    });

    if (!userExists) {
      throw new ErrorHandler(400, "User not found");
    }

    if (!Object.keys(req.body)) {
      throw new ErrorHandler(400, "Fill in all required data");
    }

    const profile = await connectDB
      .getRepository(Profile)
      .findOne({ where: {user: {id: userExists.id}}})

    if (!profile) {
      throw new ErrorHandler(400, "Error in creating user profile");
    }

    return res.status(200).json({
      success: true,
      message: "Retrieved user profile",
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

export default { createProfile, getUserProfile };
