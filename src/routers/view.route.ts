import express from "express";

const viewRouter = express.Router();

viewRouter.get("/", (req, res) => {
  res.render("users", { sessionName: "Express" });
});

export { viewRouter };
