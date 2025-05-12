// config/storage.js
import { Storage } from "@google-cloud/storage";
import { config } from "dotenv";

config();

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const keyFilename = process.env.GOOGLE_APPLICATION_KEY;

export const storage = new Storage({ projectId, keyFilename });
export const bucket = storage.bucket(bucketName);

export const uploadFiles = async (files, fileOutputNames) => {
  const uploadedUrls = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const destination = fileOutputNames[i];

    const blob = bucket.file(destination);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
      predefinedAcl: "publicRead", // делает файл публично доступным
    });

    await new Promise((resolve, reject) => {
      blobStream.on("error", reject);
      blobStream.on("finish", resolve);
      blobStream.end(file.buffer); // ⚠️ передаём содержимое файла напрямую из памяти
    });

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
    uploadedUrls.push(publicUrl);
  }

  return uploadedUrls;
};
