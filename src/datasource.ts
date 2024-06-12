import "dotenv/config";
import { DataSource } from "typeorm";

export const db = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as any,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  // entities: [Users, Permission],
  entities: ["src/entity/**/*.ts"],
  subscribers: [],
  migrations: [],
});

db.initialize()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => console.log("Error connecting database", error));
