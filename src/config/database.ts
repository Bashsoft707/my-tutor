import { ConnectOptions, connect } from "mongoose";
import { MONGO_URL } from "../helpers";

const dbURL = MONGO_URL || "mongodb://localhost/auth";

const connectDB = () => {
  connect(dbURL, {
    retryWrites: true,
    w: "majority",
  } as ConnectOptions)
    .then(() => console.log("mongodb connected"))
    .catch((err) => console.log(err, "db disconnected"));
};

export default connectDB;