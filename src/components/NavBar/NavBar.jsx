import { useState, useEffect } from "react";
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
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../data/firebase";


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
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    loadCategoriesAndBrands();
  }, []);

  const loadCategoriesAndBrands = async () => {
    try {
      const categoriesSnap = await getDocs(collection(db, 'categories'));
      const brandsSnap = await getDocs(collection(db, 'brands'));
      
      setCategories(categoriesSnap.docs.map(doc => doc.data()));
      setBrands(brandsSnap.docs.map(doc => doc.data()));
    } catch (error) {
      console.error('Error loading categories/brands:', error);
    }
  };

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
              {categories.map(cat => (
                <NavDropdown.Item key={cat.value} as={Link} to={`/category/${cat.value}`}>
                  {cat.name.toUpperCase()}
                </NavDropdown.Item>
              ))}
            </HoverDropdown>


            <HoverDropdown title="Marcas">
              {brands.map(brand => (
                <NavDropdown.Item key={brand.value} as={Link} to={`/brand/${brand.value}`}>
                  {brand.name.toUpperCase()}
                </NavDropdown.Item>
              ))}
            </HoverDropdown>
          </Nav>

          
          
          {/* Carrito */}
          <CartWidget count={cartCount}/>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
