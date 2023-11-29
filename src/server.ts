import express, { NextFunction, Response, Request } from "express";
import { PORT, handleError, NODE_ENV } from "./helpers";
import { connectDB } from "./config/database";
import { user } from "./routes";
import "reflect-metadata";

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
