import { useState } from "react";
import { Container, Button, Card, Alert, Form } from "react-bootstrap";
import { downloadProductsFromFirestore, fullSyncProducts, deleteAllProducts, fullSyncProductsFromFile } from "../../data/firebase";

// Contraseña cifrada (usa una variable de entorno en producción)
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/json") {
      setSelectedFile(file);
      setMessage({ type: 'info', text: `📄 Archivo seleccionado: ${file.name}` });
    } else {
      setSelectedFile(null);
      setMessage({ type: 'danger', text: '❌ Por favor selecciona un archivo JSON válido' });
    }
  };

  const handleSyncFromFile = async () => {
    if (!selectedFile) {
      setMessage({ type: 'danger', text: '❌ Debes seleccionar un archivo JSON primero' });
      return;
    }

    if (!globalThis.confirm(`🔄 ¿Sincronizar productos desde el archivo "${selectedFile.name}"?`)) {
      return;
    }

    try {
      // Leer el archivo JSON
      const fileContent = await selectedFile.text();
      const productsArray = JSON.parse(fileContent);

      if (!Array.isArray(productsArray)) {
        throw new Error('El archivo debe contener un array de productos');
      }

      // Sincronizar con Firestore
      const result = await fullSyncProductsFromFile(productsArray);
      setMessage({ 
        type: 'success', 
        text: `✅ Sincronización completa desde archivo! ✏️ Actualizados: ${result.updated} | ➕ Agregados: ${result.added} | 🗑️ Eliminados: ${result.deleted}` 
      });
      setSelectedFile(null);
      // Resetear el input de archivo
      document.getElementById('fileInput').value = '';
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'danger', text: '❌ Error al procesar archivo: ' + error.message });
    }
  };

  const handleFullSync = async () => {
    if (!globalThis.confirm('🔄 Sincronización completa: actualizará, agregará y eliminará productos según el JSON. ¿Continuar?')) {
      return;
    }
    try {
      const result = await fullSyncProducts();
      setMessage({ 
        type: 'success', 
        text: `✅ Sincronización completa! ✏️ Actualizados: ${result.updated} | ➕ Agregados: ${result.added} | 🗑️ Eliminados: ${result.deleted}` 
      });
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'danger', text: '❌ Error al sincronizar: ' + error.message });
    }
  };

  const handleDownload = async () => {
    try {
      await downloadProductsFromFirestore();
      setMessage({ type: 'success', text: '✅ Archivo JSON descargado exitosamente!' });
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'danger', text: '❌ Error al descargar productos: ' + error.message });
    }
  };

  const handleDeleteAll = async () => {
    if (!globalThis.confirm('⚠️⚠️ PELIGRO: Esto eliminará TODOS los productos de Firestore. ¿Estás seguro?')) {
      return;
    }
    if (!globalThis.confirm('⚠️ ÚLTIMA CONFIRMACIÓN: Se eliminarán TODOS los productos permanentemente. ¿Continuar?')) {
      return;
    }
    try {
      const result = await deleteAllProducts();
      setMessage({ 
        type: 'warning', 
        text: `✅ Todos los productos eliminados (${result.deleted}). Ahora sincroniza para cargar productos limpios.` 
      });
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'danger', text: '❌ Error al eliminar productos: ' + error.message });
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

  // Pantalla de login
  if (!isAuthenticated) {
    return (
      <Container className="my-5" style={{ maxWidth: '500px' }}>
        <Card>
          <Card.Header className="bg-dark text-white text-center">
            <h2 className="mb-0">🔒 Acceso Restringido</h2>
          </Card.Header>
          <Card.Body>
            <p className="text-center text-muted mb-4">
              Panel de administración protegido. Ingresa la contraseña para continuar.
            </p>
            
            {loginError && (
              <Alert variant="danger">{loginError}</Alert>
            )}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña de administrador</Form.Label>
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

  // Pantalla de administración (solo si está autenticado)
  return (
    <Container className="my-5">
      <Card>
        <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Panel de Administración</h2>
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

          <div className="d-grid gap-3">
            <div>
              <h5>📤 Cargar archivo JSON y sincronizar</h5>
              <p className="text-muted">
                Selecciona un archivo products.json desde tu ordenador y sincroniza Firestore:
                <br/>• ✏️ Actualiza productos modificados
                <br/>• ➕ Agrega productos nuevos
                <br/>• 🗑️ Elimina productos que ya no están en el archivo
              </p>
              <Form.Group className="mb-3">
                <Form.Control
                  id="fileInput"
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <small className="text-success d-block mt-2">✓ Archivo listo: {selectedFile.name}</small>
                )}
              </Form.Group>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleSyncFromFile}
                className="w-100"
                disabled={!selectedFile}
              >
                📤 SINCRONIZAR DESDE ARCHIVO
              </Button>
              <small className="text-info d-block mt-2">✓ Opción recomendada para producción (Vercel)</small>
            </div>

            <hr />

            <div>
              <h5>🔄 Sincronización desde código</h5>
              <p className="text-muted">
                Sincroniza con el archivo products.json incluido en el código:
                <br/>• Solo funciona en desarrollo local
                <br/>• No disponible en producción
              </p>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleFullSync}
                className="w-100"
              >
                🔄 SINCRONIZAR CON JSON
              </Button>
              <small className="text-info d-block mt-2">✓ Esta es la única opción que necesitas usar</small>
            </div>

            <hr />

            <div>
              <h5>🗑️ Limpiar base de datos</h5>
              <p className="text-muted text-danger">
                <strong>⚠️ USO ÚNICO:</strong> Elimina todos los productos duplicados/viejos de Firestore.
                <br/>Úsalo SOLO si tienes productos sin productId. Después sincroniza.
              </p>
              <Button 
                variant="danger" 
                size="lg" 
                onClick={handleDeleteAll}
                className="w-100"
              >
                🗑️ ELIMINAR TODOS LOS PRODUCTOS
              </Button>
              <small className="text-danger d-block mt-2">⚠️ Requiere doble confirmación</small>
            </div>

            <hr />

            <div>
              <h5>Descargar productos de Firestore</h5>
              <p className="text-muted">Descarga todos los productos actuales de Firestore como archivo JSON (backup)</p>
              <Button 
                variant="success" 
                size="lg" 
                onClick={handleDownload}
                className="w-100"
              >
                📥 DESCARGAR PRODUCTOS DE FIRESTORE
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
