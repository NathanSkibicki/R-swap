// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfI2RRmITU0gcnRyxc1l9xZnqylAp28gY",
  authDomain: "resume-swap.firebaseapp.com",
  projectId: "resume-swap",
  storageBucket: "resume-swap.firebasestorage.app",
  messagingSenderId: "1085522891492",
  appId: "1:1085522891492:web:556fb9f4da24b5cab852f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const writeStringToFirestore = async (stringData) => {
  try {
    const docRef = await addDoc(collection(db, "strings"), {
      text: stringData,
      timestamp: new Date()
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error writing document: ", error);
    throw error;
  }
};

export { db };