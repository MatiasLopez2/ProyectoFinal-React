import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Container className="text-center mt-5">
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <h2 className="mb-4">Página no encontrada</h2>
      <p className="text-muted mb-4">
        Ups... La página que buscás no existe o fue movida.
      </p>
      <Link to="/">
        <Button variant="primary">Volver al inicio</Button>
      </Link>
    </Container>
  );
}
