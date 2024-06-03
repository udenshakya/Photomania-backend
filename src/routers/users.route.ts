import express from "express";
import { usersController } from "../controllers";
import { authenticateToken } from "../middlewares/authenticateToken";

const usersRouter = express.Router();

usersRouter.post("/register", usersController.register);
usersRouter.post("/login", usersController.login);
usersRouter.get("/my", authenticateToken, usersController.myProfile);
usersRouter.get(
  "/:userId/posts",
  authenticateToken,
  usersController.getUserPosts
);
usersRouter.post("/logout", authenticateToken, usersController.logout);

usersRouter.get("/", usersController.list);
usersRouter.get("/:id", usersController.getUserByID);
// usersRouter.post("/", usersController.create);
usersRouter.put("/:id", usersController.updateUser);
usersRouter.delete("/:id", usersController.deleteUser);

export { usersRouter };
