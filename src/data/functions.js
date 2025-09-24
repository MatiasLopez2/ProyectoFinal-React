export async function getProducts() {
  const response = await fetch("/data/products.json");
  if (!response.ok) throw new Error(`Error al traer productos: ${response.status}`);
  const products = await response.json();
  return new Promise(resolve => setTimeout(() => resolve(products), 500)); // retardo simulado
}


// export async function getProductById(idParam) {
//   try {
//     const response = await fetch(`/data/products.json`);
//     if (!response.ok) throw new Error(`Error al traer productos: ${response.status}`);

//     const products = await response.json();
//     return products.find(p => p.id === Number(idParam));
//   } catch (error) {
//     console.error("Error en getProductById:", error);
//     throw error;
//   }
// }

export async function getProductById(idParam) {
  const response = await fetch("/data/products.json");
  const products = await response.json();
  const requestProduct = products.find(p => p.id === Number(idParam));

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(requestProduct);
    }, 1000);
  });
}

export async function getProductByCategory(categParam) {
  const products = await getProducts();
  return products.filter(p => p.category === categParam);
}

