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
  
  // Estados para modal de edición de subcategorías
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [subcategoryInput, setSubcategoryInput] = useState('');

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

  const openEditModal = (category) => {
    setEditingCategory(category);
    setSubcategoryInput('');
    setError('');
    setShowEditModal(true);
  };

  const handleAddSubcategories = async () => {
    if (!subcategoryInput.trim()) {
      setError('Ingresa al menos una subcategoría');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Dividir por comas o saltos de línea
      const subcategories = subcategoryInput
        .split(/[,\n]/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

      // Agregar cada subcategoría
      for (const subcat of subcategories) {
        const data = {
          name: subcat,
          value: subcat.toLowerCase().replace(/\s+/g, '-'),
          parentId: editingCategory.id
        };
        await addDoc(collection(db, 'categories'), data);
      }

      setSubcategoryInput('');
      setShowEditModal(false);
      await loadData();
      alert(`✅ ${subcategories.length} subcategoría(s) agregada(s) exitosamente`);
    } catch (err) {
      setError('Error al agregar subcategorías: ' + err.message);
    } finally {
      setLoading(false);
    }
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
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(cat => (
                  <>
                    {/* Categoría Principal - Nivel 1 */}
                    <tr key={cat.id} className="fw-bold" style={{ backgroundColor: '#f8f9fa' }}>
                      <td>📁 {cat.name}</td>
                      <td><span className="badge bg-primary">Nivel 1</span></td>
                      <td><code>{cat.value}</code></td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-1"
                          onClick={() => openEditModal(cat)}
                          title="Agregar subcategorías (nivel 2)"
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete('category', cat.id)}
                        >
                          🗑️
                        </Button>
                      </td>
                    </tr>
                    
                    {/* Subcategorías Nivel 2 */}
                    {categories
                      .filter(subcat => subcat.parentId === cat.id)
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(subcat => (
                        <>
                          <tr key={subcat.id} style={{ backgroundColor: '#fff' }}>
                            <td style={{ paddingLeft: '2rem' }}>└─ {subcat.name}</td>
                            <td><span className="badge bg-info">Nivel 2</span></td>
                            <td><code>{subcat.value}</code></td>
                            <td>
                              <Button
                                variant="warning"
                                size="sm"
                                className="me-1"
                                onClick={() => openEditModal(subcat)}
                                title="Agregar subcategorías (nivel 3)"
                              >
                                ✏️
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete('category', subcat.id)}
                              >
                                🗑️
                              </Button>
                            </td>
                          </tr>
                          
                          {/* Sub-subcategorías Nivel 3 */}
                          {categories
                            .filter(subsubcat => subsubcat.parentId === subcat.id)
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map(subsubcat => (
                              <tr key={subsubcat.id} style={{ backgroundColor: '#f8f9fa' }}>
                                <td style={{ paddingLeft: '4rem' }}>└── {subsubcat.name}</td>
                                <td><span className="badge bg-success">Nivel 3</span></td>
                                <td><code>{subsubcat.value}</code></td>
                                <td>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete('category', subsubcat.id)}
                                  >
                                    🗑️
                                  </Button>
                                </td>
                              </tr>
                            ))}
                        </>
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
              {brands.slice().sort((a, b) => a.name.localeCompare(b.name)).map(brand => (
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
                {categories.filter(cat => !cat.parentId)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(cat => (
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

      {/* Modal para editar y agregar subcategorías múltiples */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            ✏️ Agregar Subcategorías {editingCategory && !editingCategory.parentId ? '(Nivel 2)' : '(Nivel 3)'} a: {editingCategory?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Alert variant="info">
            <strong>💡 Tip:</strong> Puedes agregar múltiples subcategorías separándolas con comas o en líneas diferentes.
            <br />
            <small>
              {editingCategory && !editingCategory.parentId 
                ? 'Ejemplo: Amoladoras Angulares, Taladros, Lijadoras'
                : 'Ejemplo: 4 1/2", 7", 9" o cada una en una línea nueva'
              }
            </small>
          </Alert>

          <Form.Group className="mb-3">
            <Form.Label>
              Subcategorías {editingCategory && !editingCategory.parentId ? '(Nivel 2)' : '(Nivel 3 - Filtros)'}
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={subcategoryInput}
              onChange={(e) => setSubcategoryInput(e.target.value)}
              placeholder={editingCategory && !editingCategory.parentId 
                ? 'Ej:\nAmoladoras Angulares\nTaladros Percutores\nLijadoras Orbitales\n\nO separado por comas'
                : 'Ej:\n4 1/2"\n7"\n9"\n\nO separado por comas: 4 1/2", 7", 9"'
              }
              autoFocus
            />
            <Form.Text className="text-muted">
              Los valores se generarán automáticamente (ej: &quot;Amoladoras Angulares&quot; → &quot;amoladoras-angulares&quot;)
            </Form.Text>
          </Form.Group>

          {/* Mostrar subcategorías existentes */}
          {categories.filter(c => c.parentId === editingCategory?.id).length > 0 && (
            <div className="mb-3">
              <h6 className="text-muted">Subcategorías existentes:</h6>
              <div className="d-flex flex-wrap gap-2">
                {categories
                  .filter(c => c.parentId === editingCategory?.id)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(subcat => (
                    <span key={subcat.id} className="badge bg-success">
                      {subcat.name}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleAddSubcategories} disabled={loading}>
            {loading ? 'Agregando...' : '➕ Agregar Subcategorías'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
