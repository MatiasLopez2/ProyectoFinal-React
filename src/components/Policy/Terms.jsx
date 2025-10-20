import React from "react";
import { Container, Card } from "react-bootstrap";

const Terms = () => (
  <Container className="my-5">
    <Card>
      <Card.Header className="bg-primary text-white">Términos y Condiciones</Card.Header>
      <Card.Body style={{ margin: "20px 0px"}}>
        <p>
          Bienvenido a nuestra web. Al utilizar este sitio, aceptas que la información que nos brindes
          en el formulario será usada únicamente para procesar tu pedido y contactarte para coordinar la entrega o el servicio solicitado.
        </p>
        <p>No realizamos ventas directas en línea; todos los pedidos se gestionan posteriormente a través de nuestro equipo.</p>
        <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado del sitio implica la aceptación de dichos cambios.</p>
      </Card.Body>
    </Card>
  </Container>
);

export default Terms;
