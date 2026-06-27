import React from "react";
import { Container, Card } from "react-bootstrap";
import "./Policy.css";

const HowToBuy = () => (
<Container className="my-5 policy-container">
  <Card>
    <Card.Header style={{ backgroundColor: "#f2ca30", color: "#000", fontWeight: "600" }}>
      Cómo Realizar un Pedido
    </Card.Header>
    <Card.Body style={{ margin: "20px 0px" }}>
      <ul style={{ listStyle: "inside", textAlign: "left" }}>
        <li>
          Ponete en contacto con nosotros para consultar sobre los productos que te interesan.
        </li>
        <li>
          Nos pondremos en contacto con vos para confirmar la disponibilidad y
          preparar tu pedido.
        </li>
        <li>
          El retiro y el pago se realizan en nuestro local. Aceptamos
          transferencias y efectivo.
        </li>
      </ul>
      <p>
        De esta manera podemos confirmar el stock antes de la compra y brindarte
        una mejor atención.
      </p>
    </Card.Body>
  </Card>
</Container>
);

export default HowToBuy;
