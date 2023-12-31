import { RequestHandler } from "express";
import { connectDB } from "../config/database";
import { Profile, User } from "../entity";
import { ErrorHandler, SECRET_KEY } from "../helpers";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

const register: RequestHandler = async (req, res, next) => {
  try {
    const salt = Math.floor(Math.random() * 10);
    const {
      username,
      email,
      password: plainTextPassword,
      businessName,
      ...rest
    } = req.body;

    const userExists = await connectDB.getRepository(User).findOne({
      where: { email },
    });

    if (userExists) {
      throw new ErrorHandler(400, "User already exists");
    }

    if (plainTextPassword?.length < 6) {
      throw new ErrorHandler(
        400,
        "Password must be at least 6 characters long"
      );
    }

    const hashPassword = await bcrypt.hash(plainTextPassword, salt);

    const newUser = await connectDB.getRepository(User).save({
      username,
      email,
      password: hashPassword,
      ...rest,
    });

    if (!newUser) {
      throw new ErrorHandler(400, "Error in creating user");
    }

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: newUser,
    });
  } catch (err) {
    next(err);
  }
};

const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password: plainTextPassword } = req.body;

    // Check if the user exists on the local database
    const userExists = await connectDB.manager.findOne(User, {
      where: { email },
      // relations: ["profile"]
    });

    if (!userExists) {
      throw new ErrorHandler(404, "User account does not exist");
    }

    // const profile = await connectDB.getRepository(Profile).findOne({
    //   where: { user: { id: userExists.id } },
    //   relations: ["user"]
    // });

    // console.log(profile);

    // Check the password
    const { email: userMail, password, username } = userExists ?? {};

    const isPasswordCorrect = await bcrypt.compare(plainTextPassword, password);

    if (!isPasswordCorrect) {
      throw new ErrorHandler(401, "Invalid password");
    }

    // Generate JWT token
    const token = sign(
      {
        _id: userExists.id,
        username,
        email: userMail,
      },
      (SECRET_KEY as string) || "secretKey",
      {
        expiresIn: "12h",
      }
    );

    return res.status(200).send({
      status: "ok",
      message: "Logged in successfully",
      data: { token, user: userExists },
    });
  } catch (err) {
    next(err);
  }
};

export default { register, login };
