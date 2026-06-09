import { useState, useEffect } from "react";
import { Form, Button, Row, Col, Alert, Image } from "react-bootstrap";
import { addDoc, collection, doc, updateDoc, deleteDoc, getDocs, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Inicializar Firebase (reutilizamos la config)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRESTORE_APPIKEY,
  authDomain: "ecommerce-coderhouse-22.firebaseapp.com",
  projectId: import.meta.env.VITE_FIRESTORE_PROJECT_ID,
  storageBucket: "ecommerce-coderhouse-22.firebasestorage.app",
  messagingSenderId: "287312783143",
  appId: import.meta.env.VITE_FIRESTORE_APPID,
  measurementId: "G-PRCK19015V"
};

const app = initializeApp(firebaseConfig, 'secondary');
const db = getFirestore(app);

export default function ProductForm({ product, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    productId: '',
    title: '',
    price: '',
    category: '',
    brand: '',
    description: '',
    featured: false,
    img: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const initializeForm = async () => {
      // Cargar categorías y marcas
      await loadCategoriesAndBrands();

      if (product) {
        setFormData({
          productId: product.productId || '',
          title: product.title || '',
          price: product.price || '',
          category: product.category || '',
          brand: product.brand || '',
          description: product.description || '',
          featured: product.featured || false,
          img: product.img || []
        });
      } else {
        // Generar productId automáticamente para nuevo producto
        const nextId = await getNextProductId();
        setFormData(prev => ({
          ...prev,
          productId: nextId
        }));
      }
    };

    initializeForm();
  }, [product]);

  const loadCategoriesAndBrands = async () => {
    try {
      const categoriesSnap = await getDocs(collection(db, 'categories'));
      const brandsSnap = await getDocs(collection(db, 'brands'));
      
      const allCategories = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(allCategories);
      setBrands(brandsSnap.docs.map(doc => doc.data()));
    } catch (error) {
      console.error('Error loading categories/brands:', error);
      setCategories([]);
      setBrands([]);
    }
  };

  const getNextProductId = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'items'));
      const products = querySnapshot.docs.map(doc => doc.data());
      const maxId = products.reduce((max, p) => {
        const id = p.productId || 0;
        return Math.max(max, id);
      }, 0);
      return maxId + 1;
    } catch (error) {
      console.error('Error getting next ID:', error);
      return 1;
    }
  };

  const handleDeleteImage = async (imageUrl, index) => {
    try {
      // Cloudinary maneja la eliminación automáticamente
      // (las imágenes sin referencias se limpian automáticamente en el plan gratuito)
      
      // Actualizar formData removiendo la imagen
      setFormData(prev => ({
        ...prev,
        img: prev.img.filter((_, i) => i !== index)
      }));

      // Si estamos editando, actualizar también en Firestore
      if (product?.id) {
        const productRef = doc(db, 'items', product.id);
        const updatedImages = formData.img.filter((_, i) => i !== index);
        await updateDoc(productRef, { img: updatedImages });
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Error al eliminar imagen');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      const newUrls = [];

      for (let file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData
          }
        );

        const data = await response.json();
        newUrls.push(data.secure_url);
      }

      // Agregar las nuevas URLs al array existente
      setFormData(prev => ({
        ...prev,
        img: [...prev.img, ...newUrls]
      }));

      // Limpiar el input para permitir seleccionar las mismas imágenes de nuevo si es necesario
      e.target.value = '';
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Error al subir imágenes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const productData = {
        ...formData,
        productId: Number.parseInt(formData.productId),
        price: Number.parseFloat(formData.price),
        img: formData.img
      };

      if (product) {
        // Actualizar producto existente
        const productRef = doc(db, 'items', product.id);
        await updateDoc(productRef, productData);
        onSuccess('✅ Producto actualizado correctamente');
      } else {
        // Crear nuevo producto
        await addDoc(collection(db, 'items'), productData);
        onSuccess('✅ Producto creado correctamente');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al guardar el producto: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!globalThis.confirm('⚠️ ¿Estás seguro de eliminar este producto?')) {
      return;
    }

    setLoading(true);
    try {
      const productRef = doc(db, 'items', product.id);
      await deleteDoc(productRef);
      onSuccess('✅ Producto eliminado correctamente');
    } catch (err) {
      console.error('Error:', err);
      setError('Error al eliminar el producto: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return 'Guardando...';
    return product ? '💾 Actualizar' : '➕ Crear';
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>ID del Producto *</Form.Label>
            <Form.Control
              type="number"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              required
              disabled={!!product}
            />
            <Form.Text className="text-muted">
              {product ? 'El ID no se puede cambiar' : 'ID único numérico'}
            </Form.Text>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Precio *</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Título *</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Categoría *</Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar...</option>
              {categories.filter(cat => cat.parentId).map(cat => {
                const parent = categories.find(p => p.id === cat.parentId);
                return (
                  <option key={cat.value} value={cat.value}>
                    {parent ? `${parent.name} > ` : ''}{cat.name}
                  </option>
                );
              })}
            </Form.Select>
            <Form.Text className="text-muted">
              Selecciona la subcategoría del producto
            </Form.Text>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Marca *</Form.Label>
            <Form.Select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar...</option>
              {brands.map(brand => (
                <option key={brand.value} value={brand.value}>{brand.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Descripción *</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Imágenes</Form.Label>
        <Form.Control
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          disabled={loading}
        />
        <Form.Text className="text-muted">
          Las imágenes se subirán automáticamente al seleccionarlas. Puedes agregar más imágenes seleccionando nuevos archivos.
        </Form.Text>
        
        {/* Galería de imágenes actuales */}
        {formData.img.length > 0 && (
          <div className="mt-3">
            <small className="d-block mb-2"><strong>Imágenes actuales:</strong></small>
            <div className="d-flex flex-wrap gap-2">
              {formData.img.map((imgUrl) => (
                <div key={imgUrl} className="position-relative" style={{ width: '100px', height: '100px' }}>
                  <Image 
                    src={imgUrl} 
                    thumbnail 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute top-0 end-0"
                    style={{ padding: '2px 6px', fontSize: '12px' }}
                    onClick={() => handleDeleteImage(imgUrl, formData.img.indexOf(imgUrl))}
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          name="featured"
          label="Producto destacado"
          checked={formData.featured}
          onChange={handleChange}
        />
      </Form.Group>

      <div className="d-flex gap-2">
        <Button variant="primary" type="submit" disabled={loading}>
          {getButtonText()}
        </Button>
        
        {product && (
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            🗑️ Eliminar
          </Button>
        )}
        
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
      </div>
    </Form>
  );
}
