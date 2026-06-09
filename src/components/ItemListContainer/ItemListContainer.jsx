import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProducts, getProductByCategory, getCategories } from "../../data/firebase";
import Pagination from "../Pagination/Pagination"; 
import ItemList from "../ItemList/ItemList"; 
import "./ItemListContainer.css";

export default function ItemListContainer() {
  const { categParam, brandParam } = useParams();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [isMainCategory, setIsMainCategory] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        let data;
        if (categParam) {
          // Obtener todas las categorías para verificar si es una categoría principal
          const allCategories = await getCategories();
          const currentCategory = allCategories.find(cat => cat.value === categParam);
          
          // Guardar el nombre de la categoría para el título
          if (currentCategory) {
            setCategoryName(currentCategory.name);
          }
          
          if (currentCategory && !currentCategory.parentId) {
            // Es una categoría principal, buscar todas sus subcategorías
            setIsMainCategory(true);
            const subcats = allCategories.filter(cat => cat.parentId === currentCategory.id);
            setSubcategories(subcats);
            
            const subcategoryValues = subcats.map(cat => cat.value);
            
            // Obtener productos de todas las subcategorías
            const allProducts = await getProducts();
            data = allProducts.filter(product => 
              subcategoryValues.includes(product.category)
            );
          } else {
            // Es una subcategoría, filtrar normalmente
            setIsMainCategory(false);
            setSubcategories([]);
            data = await getProductByCategory(categParam);
          }
        } else {
          data = await getProducts();
        }
        setProducts(data);
        setCurrentPage(1);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categParam, brandParam]);

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filtered = products.filter((p) =>
    brandParam ? p.brand === brandParam : true
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filtered.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  let pageTitle = "Todos los productos";
  if (categoryName) pageTitle = categoryName;
  if (brandParam) pageTitle = brandParam;

  return (
    <div className="category">
      <h2 style={{ marginBottom: "20px", textTransform: "capitalize" }}>
        {pageTitle}
      </h2>

      {/* Panel de subcategorías si es categoría principal */}
      {isMainCategory && subcategories.length > 0 && (
        <div className="subcategories-panel" style={{ 
          marginBottom: '30px', 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h5 style={{ marginBottom: '15px', color: '#495057' }}>Subcategorías:</h5>
          <div className="d-flex flex-wrap gap-2">
            {subcategories.map(subcat => (
              <Link
                key={subcat.value}
                to={`/category/${subcat.value}`}
                className="btn btn-outline-primary"
                style={{ 
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  padding: '8px 16px'
                }}
              >
                {subcat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <ItemList products={currentProducts} />

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
