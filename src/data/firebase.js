import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getFirestore, getDoc, getDocs, query, where, addDoc, doc } from "firebase/firestore";
import products from '../../public/data/products.json';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRESTORE_APPIKEY,
  authDomain: "ecommerce-coderhouse-22.firebaseapp.com",
  projectId: import.meta.env.VITE_FIRESTORE_PROJECT_ID,
  storageBucket: "ecommerce-coderhouse-22.firebasestorage.app",
  messagingSenderId: "287312783143",
  appId: import.meta.env.VITE_FIRESTORE_APPID,
  measurementId: "G-PRCK19015V"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db=getFirestore(app);


export async function getProducts(){
  const querySnapshot = await getDocs(collection(db, 'items'));
  const documents = querySnapshot.docs;
  
  const data = documents.map(doc => {
    return {id: doc.id, ...doc.data()}
  });

  return data;
}

export async function getProductById(idParam){
  const documentRef = doc(db, "items", idParam)
  const documentSnapshot = await getDoc(documentRef)
  const docData = documentSnapshot.data()
  return {id: documentSnapshot.id, ...docData }
}

export async function getProductByCategory(categParam){
  const productsRef  = collection(db, 'items');
  const q = query(productsRef, where("category", "==", categParam));

  const querySnapshot = await getDocs(q)
  const documents = querySnapshot.docs;
  const data = documents.map(doc => {
    return {id: doc.id, ...doc.data()}
  });
  return data;
}



export async function createBuyOrder(orderData){

  const ordersRef = collection(db, 'orders');
  const newOrderDoc = await addDoc(ordersRef, orderData);

  return newOrderDoc;

}




export async function exportProductsToFirestore(){
  for (let item of products) {
    delete item.id;
    const idDoc = await addDoc( collection(db, "items"), item );
  }
}