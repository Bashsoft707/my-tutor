import Configuration, { OpenAI } from "openai";
import dotenv from "dotenv";
import { OPENAI_API_KEY } from "../helpers";
dotenv.config();

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,

});

export const openai = new OpenAI({
    organization: "org-0bSDW3omjeogbLGDce15SZ8f",
    apiKey: OPENAI_API_KEY,
});
