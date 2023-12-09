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

    const profile = await generateLearningPath(userProfile, "")

    return res.status(201).json({
      success: true,
      message: "Profile creation successful",
    });
  } catch (err) {
    next(err);
  }
};

// const lee: RequestHandler = async (req, res, next) => {
//   try {
//     const { query, userId } = req.body;

//     const userProfile = getUserProfile(userId);

//     const gpt3Response = await axios.post("/api/get", { prompt: query });

//     // Update user profile based on the response and user interactions
//     // For simplicity, let's assume the user advances to the next difficulty level after each interaction
//     updateUserProfile(userId, { ...userProfile, knowledgeLevel: 'Intermediate' });

//     // Generate the next set of lessons based on the Learning Path Generator
//     const learningPath = generateLearningPath(userProfile, curriculum);

//     res.json({ answer: gpt3Response.data.choices[0]?.text, learningPath });
//   } catch (error) {
//     next(error)
//   }
// }
