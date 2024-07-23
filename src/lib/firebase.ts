import path from "path";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
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

export async function uploadImage(file: File): Promise<string> {
	const storageRef = ref(storage, `images/${file.name}`);
	const uploadTask = uploadBytesResumable(storageRef, file);

	return new Promise((resolve, reject) => {
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				// Progress function (optional)
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log(`Upload is ${progress}% done`);
			},
			(error) => {
				// Error function
				console.error("Upload failed:", error);
				reject(error);
			},
			async () => {
				// Complete function
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