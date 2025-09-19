import multer from "multer";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
  destination(req, file, Callback) {
    Callback(null, "uploads");
  },

  filename(req, file, Callback) {
    const id = uuid();

    const extName = file.originalname.split(".").pop();

    const filename = `${id}.${extName}`;
    
    Callback(null, filename);
  },
});

export const singleUpload = multer({ storage }).single("photo");
