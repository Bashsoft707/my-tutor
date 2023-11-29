import crypto from "crypto";

export const createRef = () => {
  // if special characters are needed in the business ref then include as a parameter to the function and return the data
  return crypto.randomBytes(20).toString("hex");
};
