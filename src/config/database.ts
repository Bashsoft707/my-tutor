import { DataSource } from "typeorm";
import { User } from "../entity";
import { PG_DB, PG_PASSWORD, PG_USERNAME } from "../helpers";

export const connectDB = new DataSource({
  type: "sqlite",
  database: "localDB",
  entities: [User],
  synchronize: true,
});

// export const onlineDataSource = new DataSource({
//   type: "postgres",
//   host: "db.idrbkpexkgsxjunckxuj.supabase.co",
//   port: 5432,
//   username: PG_USERNAME,
//   password: PG_PASSWORD,
//   database: PG_DB,
//   entities: [],
//   synchronize: true,
// });
