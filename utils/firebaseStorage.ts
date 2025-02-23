// firebaseStorageUtil.ts

// Importation des fonctions nécessaires depuis le SDK Firebase
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import env from "@/lib/env";
import { logger } from "./logger";

// Configuration Firebase (remplacez ces valeurs par vos propres informations)
const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
};

// Initialisation de l'application Firebase
const app = initializeApp(firebaseConfig);
// Récupération de l'instance de Firebase Storage
const storage = getStorage(app);

/**
 * Upload d'un fichier sur Firebase Storage.
 * @param file Le fichier à uploader (de type File)
 * @param path Chemin de destination dans le bucket de stockage
 * @returns L'URL de téléchargement du fichier uploadé
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  console.log("storageRef", storageRef);
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    logger({
      message: "Error upload file to firebase storage",
      context: error,
    });
    throw error;
  }
};

/**
 * Récupération de l'URL de téléchargement d'un fichier stocké.
 * @param path Chemin du fichier dans le bucket de stockage
 * @returns L'URL de téléchargement du fichier
 */
export const getFileURL = async (path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  try {
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    logger({
      message: "Error get file url from firebase storage",
      context: error,
    });
    throw error;
  }
};

/**
 * Suppression d'un fichier depuis Firebase Storage.
 * @param path Chemin du fichier dans le bucket de stockage
 */
export const deleteFile = async (path: string): Promise<void> => {
  const storageRef = ref(storage, path);
  try {
    await deleteObject(storageRef);
    logger({
      message: "File deleted successfully",
    });
  } catch (error) {
    logger({
      message: "Error delete file from firebase storage",
      context: error,
    });
    throw error;
  }
};
