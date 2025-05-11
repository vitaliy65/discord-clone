import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const chatId = req.body.chatId;
    const userId = req.user.id;
    const dir = path.join("uploads", chatId, userId);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    // Combine sanitized name with extension
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
