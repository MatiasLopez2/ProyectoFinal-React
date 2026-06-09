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
  const [filters, setFilters] = useState([]); // Filtros nivel 3
  const [selectedFilter, setSelectedFilter] = useState("");

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
            // Es una subcategoría, verificar si tiene filtros (nivel 3)
            setIsMainCategory(false);
            
            // Buscar sub-subcategorías (filtros)
            const categoryFilters = allCategories.filter(cat => cat.parentId === currentCategory.id);
            
            if (categoryFilters.length > 0) {
              setFilters(categoryFilters);
              setSubcategories([]);
            } else {
              setFilters([]);
              setSubcategories([]);
            }
            
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

  const filtered = products.filter((p) => {
    let match = true;
    
    // Filtrar por marca si existe
    if (brandParam) {
      match = match && p.brand === brandParam;
    }
    
    // Filtrar por subcategoría nivel 3 si está seleccionada
    if (selectedFilter) {
      match = match && p.subcategory === selectedFilter;
    }
    
    return match;
  });

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
            {subcategories.sort((a, b) => a.name.localeCompare(b.name)).map(subcat => (
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

      {/* Panel de filtros si es subcategoría con filtros */}
      {!isMainCategory && filters.length > 0 && (
        <div className="filters-panel" style={{ 
          marginBottom: '30px', 
          padding: '20px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '8px',
          border: '1px solid #ffc107'
        }}>
          {/* <h5 style={{ marginBottom: '15px', color: '#856404' }}>
            Filtrar por:
          </h5> */}
          <div className="d-flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedFilter("")}
              className={`btn ${!selectedFilter ? 'btn-warning' : 'btn-outline-warning'}`}
              style={{ fontSize: '0.9rem', padding: '8px 16px' }}
            >
              Todos
            </button>
            {filters.sort((a, b) => a.name.localeCompare(b.name)).map(filter => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`btn ${selectedFilter === filter.value ? 'btn-warning' : 'btn-outline-warning'}`}
                style={{ 
                  fontSize: '0.9rem',
                  padding: '8px 16px'
                }}
              >
                {filter.name}
              </button>
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
