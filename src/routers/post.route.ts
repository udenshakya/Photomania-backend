import express from "express";
import { postController } from "../controllers";
import { authenticateToken } from "../middlewares/authenticateToken";
import multer from "multer";
import { v4 as uuid } from "uuid";

const postRouter = express.Router();

// Configure multer storage engine for file uploads
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "uploads");
  },
  filename(req, file, callback) {
    const id = uuid();
    const extName = file.originalname.split(".").pop();
    const fileName = `${id}.${extName}`;
    callback(null, fileName);
  },
});

const upload = multer({ storage });
// route
postRouter.get("/my", authenticateToken, postController.myProfile);

// postRouter.get("/", authenticateToken, postController.list);
postRouter.get("/all", postController.getAllPosts);

postRouter.get("/:id", postController.getPostByID);

postRouter.post(
  "/",
  authenticateToken,
  upload.single("myFile"),
  postController.create
);

postRouter.put(
  "/:id",
  authenticateToken,
  upload.single("myFile"),
  postController.updatePost
);
postRouter.delete("/:id", authenticateToken, postController.deletePost);
postRouter.get("/search", postController.search); //GET /post/search?caption=sunset&description=beautiful

export { postRouter };
