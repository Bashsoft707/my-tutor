import { RequestHandler } from "express";
import { connectDB } from "../config/database";
import { User } from "../entity";
import { ErrorHandler, SECRET_KEY } from "../helpers";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

const register: RequestHandler = async (req, res, next) => {
  try {
    const salt = Math.floor(Math.random() * 10);
    const {
      firstName,
      lastName,
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
      firstName,
      lastName,
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
    });

    if (!userExists) {
      throw new ErrorHandler(404, "User account does not exist");
    }

    // Check the password
    const { email: userMail, password, firstName, lastName } = userExists ?? {};

    const isPasswordCorrect = await bcrypt.compare(plainTextPassword, password);

    if (!isPasswordCorrect) {
      throw new ErrorHandler(401, "Invalid password");
    }

    // Generate JWT token
    const token = sign(
      {
        _id: userExists.id,
        firstName,
        lastName,
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
