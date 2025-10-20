import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import emailjs from "emailjs-com"; 

const ContactModern = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: ""
  });

  const [status, setStatus] = useState({ success: null, message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_p5juivx",      // Service ID
        "template_fqsa7zb",     // Template ID
        formData,
        "uAbeFQqf1u-gFwAop"       // Public Key
      )
      .then(() => {
        setStatus({ success: true, message: "Mensaje enviado con éxito!" });
        setFormData({ nombre: "", email: "", asunto: "", mensaje: "" });
      })
      .catch(() => {
        setStatus({ success: false, message: "Error al enviar el mensaje, intenta nuevamente." });
      });
  };

  return (
    <Container className="my-5">
      <Card style={{ borderRadius: "12px", boxShadow: "0 5px 20px rgba(0,0,0,0.1)" }}>
        <Card.Header className="bg-primary text-white" style={{ borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}>
          <h2 className="mb-0">Contacto</h2>
        </Card.Header>
        <Card.Body style={{ margin: "20px 0px", padding:"30px"}}>
          {status.message && (
            <Alert variant={status.success ? "success" : "danger"}>{status.message}</Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row className="mb-1">
              <Col md={6}>
                <Form.Group controlId="nombre" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Ingresar nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: "8px" }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="email" className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="tu@email.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: "8px" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="asunto" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Asunto de tu mensaje"
                name="asunto"
                value={formData.asunto}
                onChange={handleChange}
                required
                style={{ borderRadius: "8px" }}
              />
            </Form.Group>

            <Form.Group controlId="mensaje" className="mb-3">
              <Form.Control
                as="textarea"
                rows={6}
                placeholder="Escribe tu mensaje aquí..."
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                required
                style={{ borderRadius: "8px" }}
              />
            </Form.Group>

            <Button type="submit" variant="primary" size="lg" style={{ borderRadius: "8px" }}>
              Enviar Mensaje
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ContactModern;
