// Script para inicializar categorías y marcas en Firestore
// Ejecutar una sola vez desde la consola del navegador en /admin22

import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function initializeCategoriesAndBrands() {
  const categories = [
    { name: 'Caladoras', value: 'caladoras' },
    { name: 'Amoladoras', value: 'amoladoras' },
    { name: 'Lijadoras', value: 'lijadoras' },
    { name: 'Sierras', value: 'sierras' }
  ];

  const brands = [
    { name: 'Bosch', value: 'bosch' },
    { name: 'DeWalt', value: 'dewalt' },
    { name: 'Makita', value: 'makita' },
    { name: 'Stanley', value: 'stanley' },
    { name: 'Skil', value: 'skil' },
    { name: 'Black+Decker', value: 'black+decker' }
  ];

  console.log('Inicializando categorías...');
  for (const cat of categories) {
    await addDoc(collection(db, 'categories'), cat);
  }

  console.log('Inicializando marcas...');
  for (const brand of brands) {
    await addDoc(collection(db, 'brands'), brand);
  }

  console.log('✅ Inicialización completada');
}

// Para ejecutar: 
// 1. Abre la consola del navegador en /admin22
// 2. Importa y ejecuta: initializeCategoriesAndBrands()
