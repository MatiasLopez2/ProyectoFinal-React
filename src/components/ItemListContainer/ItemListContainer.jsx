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
  const [allCategories, setAllCategories] = useState([]); // Todas las categorías
  const [expandedCategories, setExpandedCategories] = useState({}); // Estado de expansión
  const [selectedFilter, setSelectedFilter] = useState(null); // Filtro nivel 3 seleccionado

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        let data;
        if (categParam) {
          // Obtener todas las categorías
          const categoriesData = await getCategories();
          setAllCategories(categoriesData);
          const currentCategory = categoriesData.find(cat => cat.value === categParam);
          
          // Guardar el nombre de la categoría para el título
          if (currentCategory) {
            setCategoryName(currentCategory.name);
            
            // Auto-expandir la categoría actual y sus padres
            const expandPath = {};
            let cat = currentCategory;
            while (cat) {
              expandPath[cat.id] = true;
              cat = categoriesData.find(c => c.id === cat.parentId);
            }
            setExpandedCategories(expandPath);
          }
          
          // Si es categoría principal, mostrar productos de todas sus subcategorías
          if (currentCategory && !currentCategory.parentId) {
            const subcats = categoriesData.filter(cat => cat.parentId === currentCategory.id);
            const subcategoryValues = subcats.map(cat => cat.value);
            
            const allProducts = await getProducts();
            data = allProducts.filter(product => 
              subcategoryValues.includes(product.category)
            );
          } else {
            // Categoría de nivel 2 o 3, filtrar por su valor
            data = await getProductByCategory(categParam);
          }
        } else {
          const categoriesData = await getCategories();
          setAllCategories(categoriesData);
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

  // Filtrar productos
  let filtered = products.filter((p) => 
    brandParam ? p.brand === brandParam : true
  );

  // Aplicar filtro de nivel 3 si está seleccionado
  if (selectedFilter) {
    filtered = filtered.filter(p => p.subcategory === selectedFilter);
  }

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filtered.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  let pageTitle = "Todos los productos";
  if (categoryName) pageTitle = categoryName;
  if (brandParam) pageTitle = brandParam;

  // Función para toggle expansión de categorías
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Renderizar árbol de categorías recursivo (solo nivel 1 y 2)
  const renderCategoryTree = (parentId = null, level = 0) => {
    const categories = allCategories
      .filter(cat => cat.parentId === parentId)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (categories.length === 0) return null;

    // Detener en nivel 2 (no mostrar nivel 3)
    if (level >= 2) return null;

    return categories.map(category => {
      const hasChildren = allCategories.some(cat => cat.parentId === category.id && level < 1);
      const isExpanded = expandedCategories[category.id];
      const isActive = categParam === category.value;

      return (
        <div key={category.id} style={{ marginBottom: level === 0 ? '8px' : '4px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            paddingLeft: `${level * 16}px`
          }}>
            {/* Botón de expansión */}
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleCategory(category.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  fontSize: '0.85rem',
                  color: '#000',
                  minWidth: '20px'
                }}
              >
                {isExpanded ? '▼' : '►'}
              </button>
            )}
            
            {/* Link de categoría */}
            <Link
              to={`/category/${category.value}`}
              style={{
                flex: 1,
                textDecoration: 'none',
                padding: '10px 12px',
                borderRadius: '6px',
                backgroundColor: isActive ? '#f2ca30' : 'transparent',
                color: isActive ? '#000000ff' : '#000',
                fontSize: level === 0 ? '0.95rem' : '0.9rem',
                fontWeight: level === 0 ? '600' : '500',
                border: isActive ? 'none' : '1px solid transparent',
                transition: 'all 0.2s ease',
                display: 'block',
                marginLeft: hasChildren ? '0' : '28px'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.borderColor = '#dee2e6';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = 'transparent';
                }
              }}
            >
              {/* {level === 0 && '📁 '} */}
              {/* {level === 1 && '└─ '}
              {level === 2 && '└── '} */}
              {category.name}
            </Link>
          </div>

          {/* Renderizar hijos si está expandido */}
          {hasChildren && isExpanded && (
            <div style={{ marginTop: '4px' }}>
              {renderCategoryTree(category.id, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // Obtener filtros de nivel 3 para la categoría actual
  const currentCategory = allCategories.find(cat => cat.value === categParam);
  const level3Filters = currentCategory 
    ? allCategories
        .filter(cat => cat.parentId === currentCategory.id)
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  return (
    <div className="category">
      {/* Título principal */}
      <h2 style={{ marginBottom: "16px", textTransform: "capitalize" }}>
        {pageTitle}
      </h2>

      {/* Layout con sidebar y contenido principal */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        
        {/* Sidebar de navegación - Siempre visible */}
        <aside style={{
          width: '280px',
          minWidth: '280px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '0',
          overflow: 'hidden',
          alignSelf: 'flex-start',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          {/* Header del sidebar */}
          <div style={{
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderBottom: '2px solid #dee2e6',
            position: 'sticky',
            top: 0,
            zIndex: 1
          }}>
            <h5 style={{ 
              margin: 0, 
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#212529'
            }}>
              Categorías
            </h5>
          </div>

          {/* Árbol de categorías */}
          <div style={{ padding: '16px' }}>
            {renderCategoryTree()}
          </div>
        </aside>

        {/* Contenido principal */}
        <div style={{ flex: 1, minWidth: 0 }}>
          
          {/* Barra de filtros (nivel 3) - Solo si existen */}
          {level3Filters.length > 0 && (
            <div style={{
              marginBottom: '20px',
              padding: '8px 12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #e0e0e0',
              maxWidth: 'fit-content'
            }}>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: '600',
                color: '#666',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Filtros
              </div>
              <div style={{
                display: 'flex',
                gap: '6px',
                flexWrap: 'wrap'
              }}>
                {/* Botón "Todos" */}
                <button
                  onClick={() => {
                    setSelectedFilter(null);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: '3px 10px',
                    border: selectedFilter === null ? '2px solid #007bff' : '1px solid #dee2e6',
                    borderRadius: '14px',
                    backgroundColor: selectedFilter === null ? '#007bff' : '#fff',
                    color: selectedFilter === null ? '#fff' : '#495057',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedFilter !== null) {
                      e.target.style.borderColor = '#007bff';
                      e.target.style.color = '#007bff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedFilter !== null) {
                      e.target.style.borderColor = '#dee2e6';
                      e.target.style.color = '#495057';
                    }
                  }}
                >
                  Todos
                </button>

                {/* Filtros de nivel 3 */}
                {level3Filters.map(filter => (
                  <button
                    key={filter.value}
                    onClick={() => {
                      setSelectedFilter(filter.value);
                      setCurrentPage(1);
                    }}
                    style={{
                      padding: '3px 10px',
                      border: selectedFilter === filter.value ? '2px solid #007bff' : '1px solid #dee2e6',
                      borderRadius: '14px',
                      backgroundColor: selectedFilter === filter.value ? '#007bff' : '#fff',
                      color: selectedFilter === filter.value ? '#fff' : '#495057',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedFilter !== filter.value) {
                        e.target.style.borderColor = '#007bff';
                        e.target.style.color = '#007bff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedFilter !== filter.value) {
                        e.target.style.borderColor = '#dee2e6';
                        e.target.style.color = '#495057';
                      }
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
      </div>
    </div>
  );
}
