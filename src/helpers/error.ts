import { Response } from "express";
import { IError } from "../interfaces";

export class ErrorHandler extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export const handleError = (err: IError, res: Response) => {
  const { statusCode = 500, message } = err;
  return res.status(statusCode).send({
    status: "error",
    statusCode,
    message,
  });
};
