import { RequestHandler } from "express";
import { Profile, User } from "../models";
import { ErrorHandler } from "../helpers";

const createProfile: RequestHandler = async (req, res, next) => {
  try {
    const {
      user: { _id },
    } = res.locals;

    console.log("user", res.locals.user);

    const userExists = await User.findOne({
      _id,
    });

    if (!userExists) {
      throw new ErrorHandler(400, "User not found");
    }

    if (!Object.keys(req.body)) {
      throw new ErrorHandler(400, "Fill in all required data");
    }

    const profile = await Profile.create({ ...req.body, user: _id });

    if (!profile) {
      throw new ErrorHandler(400, "Error in creating user profile");
    }

    await User.findOneAndUpdate(
      { _id },
      { profile: profile.id },
      { new: true }
    );

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
    const {
      user: { _id },
    } = res.locals;

    const userExists = await User.findOne({
      _id,
    });

    if (!userExists) {
      throw new ErrorHandler(400, "User not found");
    }

    if (!Object.keys(req.body)) {
      throw new ErrorHandler(400, "Fill in all required data");
    }

    const profile = await Profile.findOne({ user: { _id } })
      .populate("user")
      .exec();

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
