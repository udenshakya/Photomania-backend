// src/middlewares/multer.ts
import multer from "multer";
import { v4 as uuid } from "uuid";

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

export const singleUpload = upload.single("myFile");
