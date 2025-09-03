import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import CartWidget from "./CartWidget";
import logo from "../assets/img/logo.png";
import "./NavBar.css";

// Componente HoverDropdown para abrir dropdowns con hover
function HoverDropdown({ title, children }) {
  const [show, setShow] = useState(false);

  return (
    <NavDropdown
      title={title}
      id={`navbarScrollingDropdown-${title}`}
      show={show}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
    </NavDropdown>
  );
}

export default function NavBar({ cartCount }) {

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="#">
          <img className="logoHome" src={logo} alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link href="#action1">Inicio</Nav.Link>

            <HoverDropdown title="Categorias">
              <NavDropdown.Item href="#action2">Amoladoras</NavDropdown.Item>
              <NavDropdown.Item href="#action3">Sierras Circular</NavDropdown.Item>
              <NavDropdown.Item href="#action4">Lijadoras</NavDropdown.Item>
              <NavDropdown.Item href="#action5">Taladros</NavDropdown.Item>
            </HoverDropdown>

            <HoverDropdown title="Marcas">
              <NavDropdown.Item href="#action6">STANLEY</NavDropdown.Item>
              <NavDropdown.Item href="#action7">SKIL</NavDropdown.Item>
              <NavDropdown.Item href="#action8">BOSCH</NavDropdown.Item>
              <NavDropdown.Item href="#action9">MILWAUKEE</NavDropdown.Item>
              <NavDropdown.Item href="#action10">DEWALT</NavDropdown.Item>
            </HoverDropdown>
          </Nav>

          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Búsqueda"
              className="me-2"
              aria-label="Search"
            />
            <Button style={{ margin: "0px 20px 0px 2px" }} variant="outline-success">
              Search
            </Button>
          </Form>

          {/* Carrito */}
          <CartWidget count={cartCount}/>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
