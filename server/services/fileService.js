import { config } from "dotenv";

config();

export const fileService = {
  generateFileUrls: (files, chatId, userId) => {
    return files.map((file) => {
      const correctedName = Buffer.from(file.originalname, "latin1").toString(
        "utf8"
      );
      return `${chatId}/${userId}/${correctedName}`;
    });
  },
};
