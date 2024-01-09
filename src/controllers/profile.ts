import { RequestHandler } from "express";
import { Profile, User } from "../models";
import { ErrorHandler } from "../helpers";

const createProfile: RequestHandler = async (req, res, next) => {
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

    const profile = await Profile.findOne({ user: { _id } })
      .populate("user")
      .exec();

    if (!profile) {
      throw new ErrorHandler(400, "Error in retrieving user profile");
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

const updateUserProgress: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { knowledgeLevel, progress } = req.body;

    const userProfileExists = await Profile.findById(id);

    if (!userProfileExists) {
      throw new ErrorHandler(404, "User profile not found");
    }

    const knowledgeLevels = ["beginner", "intermediate", "advanced"];

    // Ensure knowledgeLevel is a valid value
    if (!knowledgeLevels.includes(knowledgeLevel)) {
      throw new ErrorHandler(400, "Invalid knowledge level");
    }

    // Update knowledgeLevel and progress based on conditions
    if (userProfileExists.knowledgeLevel !== "advanced") {
      const index = knowledgeLevels.indexOf(userProfileExists.knowledgeLevel);
      knowledgeLevel = knowledgeLevels[index + 1];
      progress = userProfileExists.progress + 30;
    }

    const updatedProfile = await Profile.findByIdAndUpdate(
      id,
      { knowledgeLevel, progress },
      { new: true }
    ).populate("user");

    if (!updatedProfile) {
      throw new ErrorHandler(500, "Error in updating user progress");
    }

    return res.status(200).json({
      success: true,
      message: "Updated user progress",
      data: updatedProfile,
    });
  } catch (err) {
    next(err);
  }
};

export default { createProfile, getUserProfile, updateUserProgress };
