import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, query, where, orderBy, limit } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfI2RRmITU0gcnRyxc1l9xZnqylAp28gY",
  authDomain: "resume-swap.firebaseapp.com",
  projectId: "resume-swap",
  storageBucket: "resume-swap.firebasestorage.app",
  messagingSenderId: "1085522891492",
  appId: "1:1085522891492:web:556fb9f4da24b5cab852f1"
};

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

// Read a specific document by ID
export const readStringFromFirestore = async (docId) => {
  try {
    const docRef = doc(db, "strings", docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error reading document: ", error);
    throw error;
  }
};

// Get all strings or query based on criteria
export const getAllStringsFromFirestore = async (queryParams = null) => {
  try {
    let stringsRef = collection(db, "strings");
    let querySnapshot;
    
    if (queryParams) {
      // Example: queryParams = { field: "text", operator: "==", value: "someText", orderByField: "timestamp", orderDirection: "desc", limitCount: 10 }
      let q = query(stringsRef);
      
      if (queryParams.field && queryParams.operator && queryParams.value !== undefined) {
        q = query(q, where(queryParams.field, queryParams.operator, queryParams.value));
      }
      
      if (queryParams.orderByField) {
        const direction = queryParams.orderDirection || "asc";
        q = query(q, orderBy(queryParams.orderByField, direction));
      }
      
      if (queryParams.limitCount) {
        q = query(q, limit(queryParams.limitCount));
      }
      
      querySnapshot = await getDocs(q);
    } else {
      querySnapshot = await getDocs(stringsRef);
    }
    
    const strings = [];
    querySnapshot.forEach((doc) => {
      strings.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return strings;
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};

export { db };