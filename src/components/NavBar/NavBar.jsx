import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import CartWidget from "../CartWidget/CartWidget";
import logo from "/img/logo.png";
import "./NavBar.css";
import { Link } from "react-router";


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
        <Navbar.Brand as={Link} to="/">
          <img className="logoHome" src={logo} alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>

            <HoverDropdown title="Categorias">
            <NavDropdown.Item as={Link} to="/category/amoladoras">
              Amoladoras
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/category/sierras">
              Sierras Circular
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/category/lijadoras">
              Lijadoras
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/category/caladoras">
              Caladoras
            </NavDropdown.Item>
          </HoverDropdown>


            <HoverDropdown title="Marcas">
              <NavDropdown.Item as={Link} to="/brand/stanley">STANLEY</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/brand/skil">SKIL</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/brand/bosch">BOSCH</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/brand/milwaukee">MILWAUKEE</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/brand/dewalt">DEWALT</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/brand/makita">MAKITA</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/brand/black+decker">BLACK+DECKER</NavDropdown.Item>
            </HoverDropdown>
          </Nav>

          
          
          {/* Carrito */}
          <CartWidget count={cartCount}/>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
