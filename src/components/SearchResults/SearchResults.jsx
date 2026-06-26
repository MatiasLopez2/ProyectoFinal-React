import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../data/firebase";
import Pagination from "../Pagination/Pagination";
import ItemList from "../ItemList/ItemList";
import { Container, Form, InputGroup, Button } from "react-bootstrap";
import { Search, X } from "lucide-react";
import "./SearchResults.css";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [newSearchTerm, setNewSearchTerm] = useState('');
  const itemsPerPage = 12;

  // Cargar todos los productos una vez
  useEffect(() => {
    const loadAllProducts = async () => {
      setLoading(true);
      try {
        const productsSnap = await getDocs(collection(db, 'items'));
        const products = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllProducts(products);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllProducts();
  }, []);

  // Filtrar productos según el query
  useEffect(() => {
    if (!query.trim()) {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter(product => 
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.brand?.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase())
      );
      setProducts(filtered);
    }
    setCurrentPage(1);
  }, [query, allProducts]);

  const handleRemoveFilter = () => {
    setSearchParams({});
  };

  const handleNewSearch = (e) => {
    e.preventDefault();
    if (newSearchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(newSearchTerm.trim())}`);
      setNewSearchTerm('');
    }
  };

  if (loading) return <p className="text-center mt-5">Buscando productos...</p>;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <>
      <Helmet>
        <title>{query ? `Búsqueda: ${query}` : 'Todos los productos'} - La Casa de la Tuerca</title>
        <meta name="description" content={query ? `Resultados de búsqueda para "${query}"` : 'Todos los productos disponibles'} />
      </Helmet>

      <Container className="my-5 search-results">
        {/* Header mejorado */}
        <div className="search-header" style={{ 
          marginBottom: '40px',
          paddingBottom: '20px',
          borderBottom: '2px solid #f2ca30'
        }}>
          <h1 style={{ 
            fontWeight: '700', 
            color: '#333',
            fontSize: '2rem',
            marginBottom: '20px'
          }}>
            {query ? 'Resultados de búsqueda' : 'Todos los productos'}
          </h1>
          
          {/* Filtro activo con botón para quitar - solo si hay query */}
          {query && (
            <div className="filter-badge" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              flexWrap: 'wrap',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '1.1rem', color: '#666' }}>
                Filtro:
              </span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#fff9e6',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '2px solid #f2ca30'
              }}>
                <span className="filter-text" style={{ 
                  color: '#f2ca30',
                  fontSize: '1.2rem',
                  fontWeight: '600'
                }}>
                  "{query}"
                </span>
                <button
                  onClick={handleRemoveFilter}
                  className="filter-remove-btn"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#f2ca30',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#d4a820';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#f2ca30';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  title="Quitar filtro"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}

          {/* Nueva barra de búsqueda */}
          <Form onSubmit={handleNewSearch} className="search-form" style={{ marginBottom: '20px' }}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Buscar más productos..."
                value={newSearchTerm}
                onChange={(e) => setNewSearchTerm(e.target.value)}
                style={{
                  borderRadius: '8px 0 0 8px',
                  border: '2px solid #f2ca30',
                  fontSize: '1rem',
                  padding: '10px 15px'
                }}
              />
              <Button
                type="submit"
                style={{
                  backgroundColor: '#f2ca30',
                  border: '2px solid #f2ca30',
                  borderRadius: '0 8px 8px 0',
                  color: '#222',
                  fontWeight: '600',
                  padding: '10px 20px'
                }}
              >
                <Search size={20} />
              </Button>
            </InputGroup>
          </Form>

          <p className="results-count" style={{ 
            color: '#666', 
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            {products.length === 0 
              ? 'No se encontraron productos que coincidan con tu búsqueda.' 
              : `✓ ${products.length} ${products.length === 1 ? 'producto encontrado' : 'productos encontrados'}`
            }
          </p>
        </div>

        {products.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: '#fff',
            borderRadius: '16px',
            marginTop: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ 
              fontSize: '4rem',
              marginBottom: '20px'
            }}>
              🔍
            </div>
            <h3 style={{ 
              color: '#333', 
              fontWeight: '600',
              fontSize: '1.5rem',
              marginBottom: '15px'
            }}>
              No encontramos productos que coincidan
            </h3>
            <p style={{ 
              color: '#999', 
              fontSize: '1rem',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Intenta con otros términos de búsqueda o navega por nuestras categorías para encontrar lo que necesitas
            </p>
          </div>
        ) : (
          <>
            <ItemList products={currentProducts} />
            
            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </Container>
    </>
  );
}
