import React from "react";
import { Container, Card } from "react-bootstrap";

const Privacy = () => (
  <Container className="my-5">
    <Card>
      <Card.Header className="bg-primary text-white">Política de Privacidad</Card.Header>
      <Card.Body style={{ margin: "20px 0px"}}>
        <p>
          Valoramos tu privacidad. Toda la información que nos proporciones en el formulario
          (nombre, contacto, detalles del pedido) será tratada de forma confidencial y utilizada únicamente
          para comunicarnos contigo y gestionar tu pedido.
        </p>
        <p>No compartimos tus datos con terceros y tomamos medidas para protegerlos.</p>
        <p>Puedes solicitar la eliminación de tus datos en cualquier momento contactándonos directamente.</p>
      </Card.Body>
    </Card>
  </Container>
);

export default Privacy;
