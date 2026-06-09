import { useState, useEffect } from "react";
import { Button, Table, Form, Modal, Alert } from "react-bootstrap";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../data/firebase";

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'category' o 'brand'
  const [newValue, setNewValue] = useState('');
  const [parentCategory, setParentCategory] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const categoriesSnap = await getDocs(collection(db, 'categories'));
      const brandsSnap = await getDocs(collection(db, 'brands'));
      
      setCategories(categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setBrands(brandsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const initializeDefaultData = async () => {
    setLoading(true);
    try {
      // Inicializar categorías por defecto
      const defaultCategories = [
        { name: 'Caladoras', value: 'caladoras' },
        { name: 'Amoladoras', value: 'amoladoras' },
        { name: 'Lijadoras', value: 'lijadoras' },
        { name: 'Sierras', value: 'sierras' }
      ];

      const defaultBrands = [
        { name: 'Bosch', value: 'bosch' },
        { name: 'DeWalt', value: 'dewalt' },
        { name: 'Makita', value: 'makita' },
        { name: 'Stanley', value: 'stanley' },
        { name: 'Skil', value: 'skil' },
        { name: 'Black+Decker', value: 'black+decker' }
      ];

      for (const cat of defaultCategories) {
        await addDoc(collection(db, 'categories'), cat);
      }

      for (const brand of defaultBrands) {
        await addDoc(collection(db, 'brands'), brand);
      }

      await loadData();
      setError('');
      alert('✅ Datos inicializados correctamente');
    } catch (err) {
      setError('Error al inicializar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newValue.trim()) {
      setError('El valor no puede estar vacío');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const collectionName = modalType === 'category' ? 'categories' : 'brands';
      const data = {
        name: newValue.trim(),
        value: newValue.toLowerCase().replace(/\s+/g, '-')
      };

      // Si es categoría y tiene padre, agregar parentId
      if (modalType === 'category') {
        data.parentId = parentCategory || null;
      }

      await addDoc(collection(db, collectionName), data);

      setNewValue('');
      setParentCategory('');
      setShowModal(false);
      await loadData();
    } catch (err) {
      setError('Error al agregar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!globalThis.confirm('¿Estás seguro de eliminar este elemento?')) return;

    try {
      const collectionName = type === 'category' ? 'categories' : 'brands';
      await deleteDoc(doc(db, collectionName, id));
      await loadData();
    } catch (err) {
      setError('Error al eliminar: ' + err.message);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setNewValue('');
    setParentCategory('');
    setError('');
    setShowModal(true);
  };

  return (
    <div>
      <h3 className="mb-4">Gestión de Categorías y Marcas</h3>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      {(categories.length === 0 && brands.length === 0) && (
        <Alert variant="info">
          No hay categorías ni marcas. 
          <Button variant="link" onClick={initializeDefaultData}>
            Click aquí para inicializar datos por defecto
          </Button>
        </Alert>
      )}

      <div className="row">
        {/* Categorías */}
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Categorías</h5>
            <Button variant="primary" size="sm" onClick={() => openModal('category')}>
              ➕ Agregar Categoría
            </Button>
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories
                .filter(cat => !cat.parentId) // Primero las principales
                .map(cat => (
                  <>
                    <tr key={cat.id} className="fw-bold">
                      <td>📁 {cat.name}</td>
                      <td>Principal</td>
                      <td><code>{cat.value}</code></td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete('category', cat.id)}
                        >
                          🗑️
                        </Button>
                      </td>
                    </tr>
                    {/* Subcategorías */}
                    {categories
                      .filter(subcat => subcat.parentId === cat.id)
                      .map(subcat => (
                        <tr key={subcat.id}>
                          <td style={{ paddingLeft: '2rem' }}>└─ {subcat.name}</td>
                          <td>Subcategoría</td>
                          <td><code>{subcat.value}</code></td>
                          <td>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete('category', subcat.id)}
                            >
                              🗑️
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </>
                ))}
            </tbody>
          </Table>
        </div>

        {/* Marcas */}
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Marcas</h5>
            <Button variant="primary" size="sm" onClick={() => openModal('brand')}>
              ➕ Agregar Marca
            </Button>
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Valor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {brands.map(brand => (
                <tr key={brand.id}>
                  <td>{brand.name}</td>
                  <td><code>{brand.value}</code></td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete('brand', brand.id)}
                    >
                      🗑️
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Modal para agregar */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Agregar {modalType === 'category' ? 'Categoría' : 'Marca'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={`Ej: ${modalType === 'category' ? 'Herramientas Eléctricas' : 'Bosch'}`}
              autoFocus
            />
            <Form.Text className="text-muted">
              El valor se generará automáticamente (ej: {newValue.toLowerCase().replace(/\s+/g, '-') || 'ejemplo'})
            </Form.Text>
          </Form.Group>

          {modalType === 'category' && (
            <Form.Group>
              <Form.Label>Categoría Padre (opcional)</Form.Label>
              <Form.Select
                value={parentCategory}
                onChange={(e) => setParentCategory(e.target.value)}
              >
                <option value="">-- Categoría Principal --</option>
                {categories.filter(cat => !cat.parentId).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Si no seleccionas nada, será una categoría principal
              </Form.Text>
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAdd} disabled={loading}>
            {loading ? 'Guardando...' : 'Agregar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
