import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";


export const uploadImage = async (file, imgPath) => {
    
  try {
    const storageRef = ref(storage, imgPath);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.error("Image upload failed:", error);
    return null;
  }
};
