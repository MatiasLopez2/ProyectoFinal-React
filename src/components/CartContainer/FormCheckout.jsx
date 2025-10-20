import { useState, useContext } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import cartContext from "../../context/cartContext";
import { createBuyOrder } from "../../data/firebase";
import emailjs from "emailjs-com";

export default function FormCheckout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(cartContext);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    mail: "",
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
  });

  const [errors, setErrors] = useState({});

  async function handleCheckout(formData) {
    setLoading(true);
    const total = cart.reduce((acc, item) => acc + item.price * item.count, 0);

    const buyOrder = {
      buyer: formData,
      cart,
      date: new Date(),
      total,
    };


    const cartProducts = cart.map(p => 
    `${p.title} \n Cantidad: ${p.count} \n Precio: $${p.price} \n Subtotal: $${(p.price*p.count).toFixed(2)}`
    ).join('\n\n');
    

    const orderDocument = await createBuyOrder(buyOrder);

    sendMail({
        nombre: formData.nombre,     
        apellido: formData.apellido,  
        email: formData.mail,
        telefono: formData.telefono,
        dni: formData.dni,
        total: total,
        orderId: orderDocument.id,
        products: cartProducts
    });

    clearCart();
    navigate(`/thankyou/${orderDocument.id}`);
    setLoading(false);
  }

  const sendMail = (data) => {
    emailjs
        .send(
        "service_p5juivx",     // Service ID
        "template_030ba2e",      // Template ID 
        data,                   
        "uAbeFQqf1u-gFwAop"    // Public Key
        )
        .then(() => {
        console.log("Correo enviado con éxito!");
        })
        .catch((error) => {
        console.error("Error al enviar el correo:", error);
        });
    };

  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) newErrors[key] = "Este campo es obligatorio.";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    handleCheckout(formData);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <Container className="my-5 d-flex justify-content-center">
      <Card style={{ maxWidth: "700px", width: "100%" }} className="shadow-lg p-4 border-0">
        <Card.Body>
          <h2 className="text-center mb-4 fw-bold text-primary">
            Datos Personales
          </h2>

          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="mail">
              <Form.Control
                type="email"
                name="mail"
                placeholder="correo@ejemplo.com"
                value={formData.mail}
                onChange={handleInputChange}
                isInvalid={!!errors.mail}
              />
              <Form.Control.Feedback type="invalid">
                {errors.mail}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="nombre">
                  <Form.Control
                    type="text"
                    name="nombre"
                    placeholder="Ingresar nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    isInvalid={!!errors.nombre}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nombre}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="apellido">
                  <Form.Control
                    type="text"
                    name="apellido"
                    placeholder="Ingresar apellidos"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    isInvalid={!!errors.apellido}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.apellido}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="dni">
                  <Form.Label>DNI</Form.Label>
                  <Form.Control
                    type="text"
                    name="dni"
                    placeholder="99999999"
                    value={formData.dni}
                    onChange={handleInputChange}
                    isInvalid={!!errors.dni}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dni}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4" controlId="telefono">
                  <Form.Label>Teléfono / Móvil</Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    placeholder="Ej. 1122334455"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    isInvalid={!!errors.telefono}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.telefono}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="text-center mt-4">
              <Col>
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  className="w-100 mb-2"
                  disabled={loading}
                >
                  {loading ? "Procesando..." : "Confirmar compra"}
                </Button>
              </Col>
              <Col>
                <Button
                  as={Link}
                  to="/cart"
                  variant="outline-secondary"
                  size="lg"
                  className="w-100"
                >
                  Volver
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
