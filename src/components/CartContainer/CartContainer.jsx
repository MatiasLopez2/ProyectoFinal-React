import { useContext } from "react";
import cartContext from "../../context/cartContext";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Link } from "react-router";
import "./CartContainer.css"


export default function CartContainer() {
  const { cart, removeItem, updateQuantity } = useContext(cartContext);

  const total = cart.reduce((acc, item) => acc + item.price * item.count, 0);

  if (cart.length === 0) {
    return (
      <Container style={{ minHeight: "80vh" }}>
        
            <h2 className="mt-5 text-center">EL CARRITO ESTA VACIO</h2>
            <p>Una vez que añadas algo a tu carrito, aparecerá acá.</p>
            <Button as={Link} to="/" variant="primary">Empezar..</Button>
            
      </Container>
    );
  }

return (
    <Container className="my-5">
      <h1 className="mb-4">Carrito</h1>

      {cart.map(item => (
        <Card key={item.id} className="mb-3 cart-card border-0">
          <Card.Body>
            <Row className="align-items-center">
              {/* Imagen del producto */}
              <Col xs={12} md={2} className="text-center">
                <img
                  src={item.img[0] || "https://via.placeholder.com/120"}
                  alt={item.title}
                  style={{
                    width: "100%",
                    maxWidth: "120px",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              </Col>

              {/* Detalle del producto */}
              <Col xs={12} md={4}>
                <h5 className="fw-semibold">{item.title}</h5>
                <p className="mb-0 text-muted">Precio unitario: ${item.price.toLocaleString()}</p>
              </Col>

              {/* Cantidad */}
              <Col xs={12} md={3} className="d-flex align-items-center justify-content-center">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => updateQuantity(item.id, Math.max(1, item.count - 1))}
                >
                  –
                </Button>

                <Form.Control
                  type="number"
                  value={item.count}
                  readOnly
                  className="mx-2 text-center"
                  style={{ width: "70px" }}
                />

                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.count + 1)}
                >
                  +
                </Button>
              </Col>

              {/* Subtotal y eliminar */}
              <Col xs={12} md={3} className="text-center">
                <p className="fw-bold mb-1">Subtotal: ${(item.price * item.count).toLocaleString()}</p>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                >
                  🗑️ Eliminar
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      {/* Total general */}
      <Row className="mt-4">
        <Col md={{ span: 4, offset: 8 }} className="text-end">
          <h4 className="fw-bold">Total: ${total.toLocaleString()}</h4>
          <Button variant="success" size="lg" as={Link} to="/FormCheckout">
            Iniciar Compra
          </Button>
        </Col>
      </Row>
    </Container>
  );
}