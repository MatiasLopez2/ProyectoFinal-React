import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Carousel } from "react-bootstrap";
import { getProductById } from "../../data/firebase"; 
import ItemCount from "../ItemCount/ItemCount";
import "./ItemDetailContainer.css";
import cartContext from "../../context/cartContext";

export default function ItemDetailContainer() {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const { idParam } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const {addToCart} = useContext(cartContext);


  useEffect(() => {
    getProductById(idParam).then(res => {
      setProduct(res);
      if (res?.img?.length) {
        setSelectedImage(res.img[0]); // primera imagen como default
      }
    });
  }, [idParam]);

  if (error) {
    return <p className="text-danger text-center mt-5">Error: {error.message}</p>;
  }

  if (!product) {
    return <p className="text-center mt-5">Cargando producto...</p>;
  }

  return (
<Container className="mt-4 product-page">
  <Row>
    {/* Galería de imágenes */}
    <Col md={6} className="product-gallery">
      <div className="main-image">
        <img src={selectedImage} alt={product.title} />
      </div>
      <div className="thumbs">
        {product.img.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`${product.title} ${i}`}
            className={selectedImage === img ? "active" : ""}
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>
    </Col>

    {/* Información del producto */}
    <Col md={6} className="product-info">
      <h2 className="fw-bold">{product.title}</h2>
      <div className="price-section">
        
        <span className="new-price text-success fw-bold">${product.price}</span>
      </div>
      <p className="stock">Stock Disponible</p>

      {/* Cantidad */}
      <p className="quantity">Cantidad</p>
      <ItemCount quantity={quantity} setQuantity={setQuantity} stock={product.stock} />
      

      <Button className="btn-cart w-100 mb-3" onClick={() => addToCart(product,quantity)}>
        Agregar al carrito
      </Button>


      
    </Col>
  </Row>

  {/* Descripción */}
  <Row className="mt-5">
    <Col md={10} className="mx-auto">
      <h3 className="fw-bold mb-3">Descripción del Producto</h3>
      <p>{product.description}</p>
    </Col>
  </Row>
</Container>

  );
}
