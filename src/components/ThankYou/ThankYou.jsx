import { useParams, Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

export default function ThankYou() {
  const { orderId } = useParams();

  return (
    <Container className="text-center my-5">
      <h1>¡Gracias por tu compra!</h1>
      <p className="mt-3 fs-5">Tu número de comprobante es:</p>
      <h3 className="fw-bold text-success">{orderId}</h3>

      <p className="mt-4">
        Te enviaremos un correo con los detalles de tu pedido.
      </p>

      <Button as={Link} to="/" variant="primary" className="mt-3">
        Volver al inicio
      </Button>
    </Container>
  );
}
