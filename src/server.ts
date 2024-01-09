import express, { NextFunction, Response, Request } from "express";
import { PORT, handleError, NODE_ENV, BARD_API_KEY } from "./helpers";
import connectDB from "./config/database";
import { user, profile } from "./routes";
import { openai } from "./config/open-ai";
import cors from "cors";
import * as fs from "fs";
import path from "path";

const app = express();

app.use(express.json());
app.use(express.text());

const port = PORT || 5000;

app.use(
  cors({
    origin: "*",
  })
);

// User routes
app.use("/api", user, profile);

app.get("/", async (_req: Request, res: Response) => {
  return res.status(200).send("WELCOME TO MY TUTOR APP!");
});

app.post("/api/chat", async (req, res, next) => {
  const chatHistory = []; // Store conversation history

  while (true) {
    // const userInput = readlineSync.question(colors.yellow('You: '));
    const userInput = req.body.question;

    try {
      // Construct messages by iterating over the history
      const messages: any = chatHistory.map(([role, content]) => ({
        role,
        content,
      }));

      // Add latest user input
      messages.push({ role: "user", content: userInput });

      // Call the API with user input & history
      // const completion = await openai.chat.completions.create({
      //   model: "gpt-3.5-turbo",
      //   messages: messages,
      // });

      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are a helpful assistant." }],
        model: "gpt-3.5-turbo",
      });

      // Get completion text/content
      const completionText = completion.choices[0].message.content;

      if (userInput.toLowerCase() === "exit") {
        console.log("Bot: " + completionText);
        return;
      }

      console.log("Bot: " + completionText);

      // Update history with user input and assistant response
      chatHistory.push(["user", userInput]);
      chatHistory.push(["assistant", completionText]);

      return res.status(200).send({ status: "ok", data: chatHistory });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
});

app.get("/api/get-datasets", (req: Request, res: Response) => {
  try {
    const filePath = path.join(__dirname, "datasets.json");

    const data = fs.readFileSync(filePath, "utf-8");

    const jsonData = JSON.parse(data);

    res.json(jsonData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.log("error:", err);
  handleError(err, res);
});

connectDB();

app.listen(port, () => {
  console.log(`======= ENV: ${NODE_ENV} =======`);
  console.log(`🚀 App listening on the port ${port}`);
});

export default app;
