import multer, { memoryStorage } from "multer";

const storage = memoryStorage();

const ulpload = multer({
  storage: storage,
}).single("image");

export default ulpload;
