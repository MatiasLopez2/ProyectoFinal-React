import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getFirestore, getDoc, getDocs, query, where, addDoc, doc, setDoc, deleteDoc, writeBatch, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
const db = getFirestore(app);

export { db };


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

// Función para descargar productos de Firestore a JSON
export async function downloadProductsFromFirestore(){
  const products = await getProducts();
  
  // Convertir a JSON
  const json = JSON.stringify(products, null, 2);
  
  // Crear un blob y descargarlo
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `products.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  
  return products;
}

// Función para eliminar TODOS los productos de Firestore
export async function deleteAllProducts() {
  try {
    console.log('🗑️ Eliminando todos los productos...');
    const currentProducts = await getProducts();
    console.log(`📦 Productos a eliminar: ${currentProducts.length}`);
    
    const batchSize = 500;
    let totalDeleted = 0;
    
    for (let i = 0; i < currentProducts.length; i += batchSize) {
      const batch = writeBatch(db);
      const chunk = currentProducts.slice(i, i + batchSize);
      
      chunk.forEach(product => {
        const productRef = doc(db, 'items', product.id);
        batch.delete(productRef);
      });
      
      await batch.commit();
      totalDeleted += chunk.length;
      console.log(`✅ Eliminados ${totalDeleted} de ${currentProducts.length}`);
    }
    
    console.log('✅ Todos los productos eliminados');
    return { deleted: currentProducts.length };
  } catch (error) {
    console.error('❌ Error en deleteAllProducts:', error);
    throw error;
  }
}

// Función de sincronización completa: agrega, actualiza y elimina productos
export async function fullSyncProducts() {
  try {
    console.log('🔄 Iniciando sincronización completa...');
    
    // Obtener productos actuales de Firestore
    const currentProducts = await getProducts();
    console.log(`📦 Productos en Firestore: ${currentProducts.length}`);
    console.log(`📄 Productos en JSON: ${products.length}`);
    
    // Crear mapas para comparación
    const firestoreMap = new Map(); // productId -> firestore doc id
    const jsonMap = new Map(); // productId -> product data
    
    // Mapear productos de Firestore por productId
    currentProducts.forEach(prod => {
      if (prod.productId) {
        firestoreMap.set(prod.productId, prod.id);
      }
    });
    
    // Mapear productos del JSON por id
    products.forEach(prod => {
      if (prod.id) {
        jsonMap.set(prod.id, prod);
      }
    });
    
    let added = 0;
    let updated = 0;
    let deleted = 0;
    
    const batch = writeBatch(db);
    const itemsRef = collection(db, 'items');
    
    // 1. ACTUALIZAR y AGREGAR productos del JSON
    for (let item of products) {
      if (!item.id) {
        console.warn(`⚠️ Producto sin ID, saltando: ${item.title}`);
        continue;
      }
      
      const productData = { ...item, productId: item.id };
      delete productData.id;
      
      const firestoreId = firestoreMap.get(item.id);
      
      if (firestoreId) {
        // Producto existe, actualizarlo
        console.log(`🔄 Actualizando: ${item.title} (ID: ${item.id})`);
        const productRef = doc(db, 'items', firestoreId);
        batch.set(productRef, productData, { merge: true });
        updated++;
      } else {
        // Producto no existe, agregarlo
        console.log(`➕ Agregando: ${item.title} (ID: ${item.id})`);
        const newProductRef = doc(itemsRef);
        batch.set(newProductRef, productData);
        added++;
      }
    }
    
    // 2. ELIMINAR productos que están en Firestore pero NO en JSON
    for (let firestoreProd of currentProducts) {
      if (firestoreProd.productId && !jsonMap.has(firestoreProd.productId)) {
        console.log(`🗑️ Eliminando: ${firestoreProd.title} (ID: ${firestoreProd.productId})`);
        const productRef = doc(db, 'items', firestoreProd.id);
        batch.delete(productRef);
        deleted++;
      }
    }
    
    console.log('💾 Guardando cambios en Firestore...');
    await batch.commit();
    console.log('✅ Sincronización completa finalizada');
    
    return { added, updated, deleted, total: added + updated };
  } catch (error) {
    console.error('❌ Error en fullSyncProducts:', error);
    throw error;
  }
}


// Función para sincronizar productos (actualizar existentes y agregar nuevos)
export async function syncProductsToFirestore() {
  try {
    const batch = writeBatch(db);
    const itemsRef = collection(db, 'items');
    
    console.log('🔍 Obteniendo productos de Firestore...');
    // Obtener todos los productos actuales de Firestore
    const currentProducts = await getProducts();
    console.log(`📦 Productos en Firestore: ${currentProducts.length}`);
    
    const currentProductsMap = new Map();
    
    // Crear un mapa con productId como clave (ID del JSON almacenado en Firestore)
    currentProducts.forEach(prod => {
      if (prod.productId) {
        currentProductsMap.set(prod.productId, prod.id);
      }
    });
    
    let added = 0;
    let updated = 0;
    
    console.log(`📄 Productos en JSON: ${products.length}`);
    
    // Procesar cada producto del JSON
    for (let item of products) {
      // Validar que el producto tenga ID
      if (!item.id) {
        console.warn(`⚠️ Producto sin ID, saltando: ${item.title}`);
        continue;
      }
      
      const productData = { ...item, productId: item.id }; // Guardar el ID del JSON como productId
      delete productData.id; // Eliminar el id original
      
      // Buscar si existe un producto con el mismo productId
      const firestoreId = currentProductsMap.get(item.id);
      
      if (firestoreId) {
        // Producto existe, actualizarlo
        console.log(`🔄 Actualizando: ${item.title} (ID: ${item.id})`);
        const productRef = doc(db, 'items', firestoreId);
        batch.set(productRef, productData, { merge: true });
        updated++;
      } else {
        // Producto no existe, agregarlo
        console.log(`➕ Agregando: ${item.title} (ID: ${item.id})`);
        const newProductRef = doc(itemsRef);
        batch.set(newProductRef, productData);
        added++;
      }
    }
    
    console.log('💾 Guardando cambios en Firestore...');
    // Ejecutar todas las operaciones
    await batch.commit();
    console.log('✅ Sincronización completa');
    
    return { added, updated, total: added + updated };
  } catch (error) {
    console.error('❌ Error en syncProductsToFirestore:', error);
    throw error;
  }
}

// Función para eliminar todos los productos y volver a cargar
export async function replaceAllProducts() {
  try {
    console.log('🗑️ Eliminando productos existentes...');
    // Eliminar todos los productos existentes
    const currentProducts = await getProducts();
    console.log(`📦 Productos a eliminar: ${currentProducts.length}`);
    
    // Firestore limita a 500 operaciones por batch
    const batchSize = 500;
    for (let i = 0; i < currentProducts.length; i += batchSize) {
      const batch = writeBatch(db);
      const chunk = currentProducts.slice(i, i + batchSize);
      
      chunk.forEach(product => {
        const productRef = doc(db, 'items', product.id);
        batch.delete(productRef);
        console.log(`🗑️ Eliminando: ${product.title}`);
      });
      
      await batch.commit();
      console.log(`✅ Batch ${Math.floor(i / batchSize) + 1} eliminado`);
    }
    
    console.log('➕ Agregando nuevos productos...');
    // Cargar los nuevos productos
    await exportProductsToFirestore();
    console.log('✅ Productos agregados');
    
    return { deleted: currentProducts.length, added: products.length };
  } catch (error) {
    console.error('❌ Error en replaceAllProducts:', error);
    throw error;
  }
}

// Función de sincronización completa con productos desde archivo cargado
export async function fullSyncProductsFromFile(productsArray) {
  try {
    console.log('🔄 Iniciando sincronización desde archivo...');
    
    // Obtener productos actuales de Firestore
    const currentProducts = await getProducts();
    console.log(`📦 Productos en Firestore: ${currentProducts.length}`);
    console.log(`📄 Productos en archivo: ${productsArray.length}`);
    
    // Crear mapas para comparación
    const firestoreMap = new Map();
    const jsonMap = new Map();
    
    // Mapear productos de Firestore por productId
    currentProducts.forEach(prod => {
      if (prod.productId) {
        firestoreMap.set(prod.productId, prod.id);
      }
    });
    
    // Mapear productos del archivo por id
    productsArray.forEach(prod => {
      if (prod.id) {
        jsonMap.set(prod.id, prod);
      }
    });
    
    let added = 0;
    let updated = 0;
    let deleted = 0;
    
    const batch = writeBatch(db);
    const itemsRef = collection(db, 'items');
    
    // 1. ACTUALIZAR y AGREGAR productos del archivo
    for (let item of productsArray) {
      if (!item.id) {
        console.warn(`⚠️ Producto sin ID, saltando: ${item.title}`);
        continue;
      }
      
      const productData = { ...item, productId: item.id };
      delete productData.id;
      
      const firestoreId = firestoreMap.get(item.id);
      
      if (firestoreId) {
        // Producto existe, actualizarlo
        console.log(`🔄 Actualizando: ${item.title} (ID: ${item.id})`);
        const productRef = doc(db, 'items', firestoreId);
        batch.set(productRef, productData, { merge: true });
        updated++;
      } else {
        // Producto no existe, agregarlo
        console.log(`➕ Agregando: ${item.title} (ID: ${item.id})`);
        const newProductRef = doc(itemsRef);
        batch.set(newProductRef, productData);
        added++;
      }
    }
    
    // 2. ELIMINAR productos que están en Firestore pero NO en el archivo
    for (let firestoreProd of currentProducts) {
      if (firestoreProd.productId && !jsonMap.has(firestoreProd.productId)) {
        console.log(`🗑️ Eliminando: ${firestoreProd.title} (ID: ${firestoreProd.productId})`);
        const productRef = doc(db, 'items', firestoreProd.id);
        batch.delete(productRef);
        deleted++;
      }
    }
    
    console.log('💾 Guardando cambios en Firestore...');
    await batch.commit();
    console.log('✅ Sincronización completa finalizada');
    
    return { added, updated, deleted, total: added + updated };
  } catch (error) {
    console.error('❌ Error en fullSyncProductsFromFile:', error);
    throw error;
  }
}