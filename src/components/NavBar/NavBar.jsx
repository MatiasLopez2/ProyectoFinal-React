import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import CartWidget from "../CartWidget/CartWidget";
import logo from "/img/logotuerca2.png";
import "./NavBar.css";
import { Link } from "react-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../data/firebase";


function HoverDropdown({ title, children }) {
  const [show, setShow] = useState(false);

  return (
    <NavDropdown
      title={title}
      id={`navbarScrollingDropdown-${title}`}
      show={show}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
    </NavDropdown>
  );
}

export default function NavBar({ cartCount }) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    loadCategoriesAndBrands();
    
    // Cerrar búsqueda al hacer clic fuera
    const handleClickOutside = () => setShowSearchResults(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const loadCategoriesAndBrands = async () => {
    try {
      const categoriesSnap = await getDocs(collection(db, 'categories'));
      const brandsSnap = await getDocs(collection(db, 'brands'));
      
      setCategories(categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setBrands(brandsSnap.docs.map(doc => doc.data()));
    } catch (error) {
      console.error('Error loading categories/brands:', error);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.trim().length > 0) {
      const subcats = categories
        .filter(cat => cat.parentId && cat.name.toLowerCase().includes(value.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));
      setFilteredSubcategories(subcats);
      setShowSearchResults(true);
    } else {
      setFilteredSubcategories([]);
      setShowSearchResults(false);
    }
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <img className="logoHome" src={logo} alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>

            <HoverDropdown title="Categorias">
              <div style={{ 
                display: 'flex', 
                minWidth: window.innerWidth <= 768 ? '100%' : '600px',
                maxWidth: window.innerWidth <= 768 ? '100%' : '700px',
                flexDirection: window.innerWidth <= 768 ? 'column' : 'row'
              }}>
                {/* Columna izquierda - Categorías principales */}
                <div style={{ 
                  width: window.innerWidth <= 768 ? '100%' : '240px', 
                  borderRight: window.innerWidth <= 768 ? 'none' : '1px solid #e0e0e0',
                  borderBottom: window.innerWidth <= 768 ? '1px solid #e0e0e0' : 'none',
                  backgroundColor: '#ffffff'
                }}>
                  {categories
                    .filter(cat => !cat.parentId)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(mainCat => {
                      const hasSubcategories = categories.some(sub => sub.parentId === mainCat.id);
                      const isHovered = hoveredCategory === mainCat.id;
                      
                      return (
                        <NavDropdown.Item
                          key={mainCat.id}
                          as={Link}
                          to={`/category/${mainCat.value}`}
                          onMouseEnter={() => setHoveredCategory(mainCat.id)}
                          style={{
                            fontWeight: '500',
                            fontSize: '0.9rem',
                            backgroundColor: isHovered ? '#f8f9fa' : 'transparent',
                            borderLeft: isHovered ? '3px solid #007bff' : '3px solid transparent',
                            padding: '10px 16px',
                            color: '#000',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {mainCat.name}
                          {hasSubcategories && (
                            <span style={{ 
                              float: 'right', 
                              fontSize: '0.9rem',
                              color: '#000'
                            }}>
                              ›
                            </span>
                          )}
                        </NavDropdown.Item>
                      );
                    })}
                </div>

                {/* Columna derecha - Subcategorías */}
                <div style={{ 
                  flex: 1, 
                  padding: '16px 20px',
                  minHeight: '250px',
                  backgroundColor: '#ffffff'
                }}>
                  {hoveredCategory ? (
                    <>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: '600', 
                        color: '#666', 
                        marginBottom: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {categories.find(c => c.id === hoveredCategory)?.name}
                      </div>
                      <div style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}>
                        {categories
                          .filter(sub => sub.parentId === hoveredCategory)
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map(subCat => (
                            <NavDropdown.Item
                              key={subCat.value}
                              as={Link}
                              to={`/category/${subCat.value}`}
                              style={{
                                fontSize: '0.9rem',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                color: '#000',
                                transition: 'background-color 0.15s ease'
                              }}
                            >
                              {subCat.name}
                            </NavDropdown.Item>
                          ))}
                      </div>
                    </>
                  ) : (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: '100%',
                      color: '#aaa',
                      fontSize: '0.85rem',
                      fontStyle: 'italic'
                    }}>
                      Selecciona una categoría
                    </div>
                  )}
                </div>
              </div>
            </HoverDropdown>


            <HoverDropdown title="Marcas">
              {brands.sort((a, b) => a.name.localeCompare(b.name)).map(brand => (
                <NavDropdown.Item key={brand.value} as={Link} to={`/brand/${brand.value}`}>
                  {brand.name.toUpperCase()}
                </NavDropdown.Item>
              ))}
            </HoverDropdown>
          </Nav>

          {/* Buscador de subcategorías */}
          <Form className="d-flex position-relative me-3" onClick={(e) => e.stopPropagation()}>
            <Form.Control
              type="search"
              placeholder="Buscar subcategorías..."
              className="me-2"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchTerm && setShowSearchResults(true)}
              style={{ minWidth: '200px' }}
            />
            {showSearchResults && filteredSubcategories.length > 0 && (
              <div 
                className="position-absolute bg-white border rounded shadow-sm"
                style={{ 
                  top: '100%', 
                  left: 0, 
                  right: 0, 
                  maxHeight: '300px', 
                  overflowY: 'auto',
                  zIndex: 1000,
                  marginTop: '5px'
                }}
              >
                {filteredSubcategories.map(subcat => {
                  const parent = categories.find(c => c.id === subcat.parentId);
                  return (
                    <Link
                      key={subcat.value}
                      to={`/category/${subcat.value}`}
                      className="dropdown-item"
                      onClick={() => {
                        setSearchTerm('');
                        setShowSearchResults(false);
                      }}
                      style={{ padding: '8px 12px' }}
                    >
                      <small className="text-muted">{parent?.name}</small>
                      <br />
                      <strong>{subcat.name}</strong>
                    </Link>
                  );
                })}
              </div>
            )}
          </Form>
          
          {/* Carrito */}
          {/* <CartWidget count={cartCount}/> */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
