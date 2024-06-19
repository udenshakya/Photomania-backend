import express from "express";
import { usersController } from "../controllers";
import { authenticateToken } from "../middlewares/authenticateToken";
import { singleUpload } from "../middlewares/multer";

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
usersRouter.post("/:id/image", singleUpload, usersController.uploadImage);

usersRouter.get("/", usersController.list);
usersRouter.get("/:id", usersController.getUserByID);
// usersRouter.post("/", usersController.create);
usersRouter.patch("/:id", authenticateToken, usersController.updateUser);
usersRouter.delete("/:id", authenticateToken, usersController.deleteUser);

export { usersRouter };
