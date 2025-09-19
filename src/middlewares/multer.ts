import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, Callback) {
    Callback(null, "uploads");
  },

  filename(req, file, Callback) {
    Callback(null, file.originalname);
  },
});

export const singleUpload = multer({ storage }).single("photo");
