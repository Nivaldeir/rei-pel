import path from "path";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import fs from "fs"
const firebaseConfig = {
	apiKey: "AIzaSyAc0ZeCCynxARSf7fE3G3lwDOcbTLxWILo",
	authDomain: "sinb-e0746.firebaseapp.com",
	projectId: "sinb-e0746",
	storageBucket: "sinb-e0746.appspot.com",
	messagingSenderId: "959252269437",
	appId: "1:959252269437:web:fefea366313a63c44ce414",
} as any;

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadPDFFromLocal(filePath: string): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  const storageRef = ref(storage, `pdfs/${fileName}`);
  const uploadTask = uploadBytesResumable(storageRef, fileBuffer);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Função de progresso (opcional)
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload está ${progress}% concluído`);
      },
      (error) => {
        // Função de erro
        console.error('Falha no upload:', error);
        reject(error);
      },
      async () => {
        // Função de conclusão
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      },
    );
  });
}