import React from "react";
import { Container, Card } from "react-bootstrap";

const HowToBuy = () => (
  <Container className="my-5">
    <Card>
      <Card.Header className="bg-primary text-white">Cómo Realizar un Pedido</Card.Header>
      <Card.Body style={{ margin: "20px 0px"}}>
        <ul style={{listStyle: "inside", textAlign: "left"}}>
          <li>Completa el formulario de pedido con tus datos y la información del producto o servicio que deseas.</li>
          <li>Nuestro equipo revisará tu solicitud y se pondrá en contacto contigo para coordinar los detalles (disponibilidad, entrega o servicio).</li>
          <li>Una vez confirmado, recibirás la información necesaria para completar tu pedido y coordinar la entrega o retiro.</li>
        </ul>
        <p>Así aseguramos que tu experiencia sea personalizada y correcta, sin compras automáticas en línea.</p>
      </Card.Body>
    </Card>
  </Container>
);

export default HowToBuy;
