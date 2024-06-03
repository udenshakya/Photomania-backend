import { DataSource } from "typeorm";

export const db = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "express_test",
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
