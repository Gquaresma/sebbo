import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import "../config/fb.js";

async function imgUpload(imgFile) {
  try {
    const timeStamp = Date.now();
    const fileName = imgFile.originalname.split(".")[0];
    const filetype = imgFile.originalname.split(".")[1];

    const imageName = `${fileName}_${timeStamp}.${filetype}`;

    const storage = getStorage();
    const imageRef = ref(storage, imageName);

    const snapshot = await uploadBytesResumable(
      imageRef,
      imgFile.buffer,
      imgFile.mimetype
    );

    return getDownloadURL(snapshot.ref);
  } catch (error) {
    throw new Error(error.message);
  }
}

async function deleteImg(imgUrl) {
  try {

    console.log(imgUrl);
    const storage = getStorage();
    const desertRef = ref(storage, imgUrl);

    return deleteObject(desertRef);
  } catch (error) {
    throw new Error(error.message);
  }
}
export {deleteImg, imgUpload}
