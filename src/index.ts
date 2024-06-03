import dotenv from "dotenv";
import express from "express";
import path from "path";
import { routers } from "./routers";
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

Object.entries(routers).forEach(([route, router]) => {
  app.use(`/api/${route}`, router);
});

app.get("/demo", (_req, res) => {
  res.render("demo", {
    sessionName: "Express",
  });
});

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.get("*", (_req, res) => {
  res.render("404");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
