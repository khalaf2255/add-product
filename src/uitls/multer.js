import multer from "multer";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirFileName = fileURLToPath(import.meta.url);

export const fileValidation = {
  image: ["image/jpeg", "image/png", "image/gif"],
  file: ["application/pdf", "application/msword"],
};

export function fileUpload(custumPath, validationFileUploaded = []) {
  const filePath = `uploads/${custumPath}`;
  const fullPath = path.join(__dirFileName, `../../${filePath}`);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, fullPath);
    },

    filename: (req, file, cb) => {
      const fullName = nanoid() + "_" + file.originalname;
      file.finalDest = `${filePath}/${fullName}`;
      cb(null, fullName);
    },
  });

  function fileFilter(req, file, cb) {
    if (validationFileUploaded.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("In-valid format"), false);
    }
  }

  const upload = multer({ dest: "uploads", fileFilter, storage });
  return upload;
}
