import express, { NextFunction, Response, Request } from "express";
import { PORT, handleError, NODE_ENV } from "./helpers";
import { connectDB } from "./config/database";
import { user } from "./routes";
import "reflect-metadata";
import { openai } from "./config/open-ai";

const app = express();

app.use(express.json());
app.use(express.text());

const initializeDataSources = async () => {
  try {
    await connectDB.initialize();
  } catch (error) {
    console.error("Error initializing data sources:", error);
    process.exit(1); // Exit the process if data source initialization fails
  }
};

initializeDataSources().then(() => {
  const port = PORT || 5000;

  // User routes
  app.use("/api", user);

  app.get("/", (_req: Request, res: Response) => {
    return res.status(200).send("WELCOME TO ONEFLARE POS DESKTOP APP!");
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
        next(error)
      }
    }
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.log("error:", err);
    handleError(err, res);
  });

  app.listen(port, () => {
    console.log(`======= ENV: ${NODE_ENV} =======`);
    console.log(`🚀 App listening on the port ${port}`);
  });
});

export default app;
