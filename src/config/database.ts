import { DataSource } from "typeorm";
import { Lesson, Profile, User } from "../entity";
import { PG_DB, PG_PASSWORD, PG_USERNAME, PG_HOST } from "../helpers";
import { LearningPath } from "../entity/learning-path";

export const connectDB = new DataSource({
  type: "postgres",
  host: PG_HOST,
  port: 5432,
  username: PG_USERNAME,
  password: PG_PASSWORD,
  database: PG_DB,
  entities: [User, Lesson, Profile, LearningPath],
  synchronize: true,
});
