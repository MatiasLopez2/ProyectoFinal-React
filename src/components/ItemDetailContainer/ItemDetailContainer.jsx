import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
    <>
      <Helmet>
        <title>{product.title} - La Casa de la Tuerca</title>
        <meta name="description" content={`${product.title} - $${product.price}. ${product.description?.substring(0, 150)}...`} />
        <meta property="og:title" content={`${product.title} - La Casa de la Tuerca`} />
        <meta property="og:description" content={product.description?.substring(0, 150)} />
        <meta property="og:image" content={product.img?.[0]} />
      </Helmet>

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
        
        <span className="price-highlight fw-bold">${product.price}</span>
      </div>

      {/* Cantidad */}
      {/* <p className="quantity">Cantidad</p>
      <ItemCount quantity={quantity} setQuantity={setQuantity} stock={product.stock} /> */}
      

      {/* <Button className="btn-cart w-100 mb-3" onClick={() => addToCart(product,quantity)}>
        Agregar al carrito
      </Button> */}

      <Button 
        className="w-100 mb-3" 
        style={{
          backgroundColor: '#25D366',
          border: 'none',
          color: 'white',
          fontWeight: '600',
          padding: '12px',
          fontSize: '1rem'
        }}
        onClick={() => {
          const message = `Hola, estoy interesado en: ${product.title} - $${product.price}`;
          const phoneNumber = '5492235425880'; 
          const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
          window.open(url, '_blank');
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#128C7E';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#25D366';
        }}
      >
        Consultar por WhatsApp
      </Button>


      
    </Col>
  </Row>

  {/* Descripción */}
  <Row className="mt-5">
    <Col md={10} className="mx-auto product-description">
      <h3 className="fw-bold mb-3">Descripción del Producto</h3>
      <p style={{ whiteSpace: 'pre-line', textAlign: 'left' }}>{product.description}</p>
    </Col>
  </Row>
</Container>
    </>
  );
}
