import { useState, useEffect } from "react";
import { Container, Button, Card, Alert, Form, Table, Modal, Tabs, Tab } from "react-bootstrap";
import { getProducts } from "../../data/firebase";
import ProductForm from "./ProductForm";
import CategoriesManager from "./CategoriesManager";
import "./AdminCRUD.css";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

export default function AdminCRUD() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'danger', text: 'Error al cargar productos' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError("");
      setPassword("");
    } else {
      setLoginError("❌ Contraseña incorrecta");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setMessage({ type: '', text: '' });
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSaveSuccess = (msg) => {
    setMessage({ type: 'success', text: msg });
    loadProducts();
    handleCloseModal();
  };

  // Filtrar productos según búsqueda
  const filteredProducts = products.filter(product => {
    const search = searchTerm.toLowerCase();
    return (
      product.title?.toLowerCase().includes(search) ||
      product.productId?.toString().includes(search) ||
      product.category?.toLowerCase().includes(search) ||
      product.brand?.toLowerCase().includes(search)
    );
  });

  // Pantalla de login
  if (!isAuthenticated) {
    return (
      <Container className="my-5" style={{ maxWidth: '500px' }}>
        <Card>
          <Card.Header className="bg-dark text-white text-center">
            <h2 className="mb-0">🔒 Acceso Admin</h2>
          </Card.Header>
          <Card.Body>
            <p className="text-center text-muted mb-4">
              Panel de administración 🦖
            </p>
            
            {loginError && (
              <Alert variant="danger">{loginError}</Alert>
            )}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingresa la contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                />
              </Form.Group>
              <Button type="submit" variant="primary" size="lg" className="w-100">
                🔓 Ingresar
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // Panel admin
  return (
    <Container className="my-5">
      <Card>
        <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
          <h2 className="mb-0">🛠️ Panel de Administración del Mati Kawa! 🏍 ️</h2>
          <Button variant="outline-light" size="sm" onClick={handleLogout}>
            🚪 Cerrar sesión
          </Button>
        </Card.Header>
        <Card.Body>
          {message.text && (
            <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
              {message.text}
            </Alert>
          )}

          <Tabs defaultActiveKey="products" className="mb-3">
            <Tab eventKey="products" title="📦 Productos">
              <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h5 className="mb-0">Total: {filteredProducts.length} de {products.length} productos</h5>
                <div className="d-flex gap-2 flex-grow-1" style={{ maxWidth: '600px' }}>
                  <Form.Control
                    type="text"
                    placeholder="🔍 Buscar por título, ID, categoría o marca..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                      ✕
                    </Button>
                  )}
                  <Button variant="success" onClick={handleAddNew}>
                    Agregar
                  </Button>
                </div>
              </div>

              {loading ? (
                <p className="text-center">Cargando productos...</p>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                  <tr>
                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Título</th>
                    <th>Precio</th>
                    <th>Categoría</th>
                    <th>Marca</th>
                    <th>Destacado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.productId || 'N/A'}</td>
                      <td>
                        {product.img && product.img[0] && (
                          <img 
                            src={product.img[0]} 
                            alt={product.title}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        )}
                      </td>
                      <td>{product.title}</td>
                      <td>${product.price?.toLocaleString()}</td>
                      <td>{product.category}</td>
                      <td>{product.brand}</td>
                      <td>{product.featured ? '⭐' : '-'}</td>
                      <td>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          className="me-2"
                          onClick={() => handleEdit(product)}
                        >
                          ✏️ Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
            </Tab>

            <Tab eventKey="categories" title="🏷️ Categorías & Marcas">
              <CategoriesManager />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      {/* Modal para agregar/editar producto */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? '✏️ Editar Producto' : '➕ Agregar Producto'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductForm 
            product={editingProduct}
            onSuccess={handleSaveSuccess}
            onCancel={handleCloseModal}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
}
