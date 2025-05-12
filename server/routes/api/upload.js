import { Router } from "express";
import passport from "passport";
import { upload } from "../../config/multer.js";
import {
  handleFileUpload,
  handleFileGet,
} from "../../controllers/uploadController.js";

const router = Router();

router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  upload.array("files"),
  handleFileUpload
);

router.get("/uploads/:chatId/:userId/:filename", handleFileGet);

export default router;
