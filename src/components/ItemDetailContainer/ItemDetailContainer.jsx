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
  const [isImageZoomed, setIsImageZoomed] = useState(false);
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
      <div className="main-image" onClick={() => setIsImageZoomed(true)} style={{ cursor: 'zoom-in' }}>
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

      {/* Opción 1 - Destacado con fondo amarillo */}
      <div style={{
        backgroundColor: '#f2ca30',
        padding: '10px 15px',
        borderRadius: '8px',
        marginBottom: '15px',
        display: 'inline-block'
      }}>
        <span style={{ color: '#000', fontWeight: '600' }}>
          Método de pago: Efectivo o transferencia
        </span>
      </div>

      

      {/* <p><span className="quantity">Método de pago: Efectivo o transferencia</span></p> */}

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
          const phoneNumber = '5492233127686'; 
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
    <Col md={10} className="mx-auto">
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ 
          fontWeight: '700', 
          marginBottom: '25px',
          color: '#333',
          borderBottom: '3px solid #f2ca30',
          paddingBottom: '10px',
          display: 'inline-block'
        }}>
          Descripción del Producto
        </h3>
        <div style={{ 
          whiteSpace: 'pre-line', 
          textAlign: 'left',
          lineHeight: '1.8',
          color: '#555',
          fontSize: '0.95rem'
        }}>
          {product.description}
        </div>
      </div>
    </Col>
  </Row>

  {/* Modal de imagen ampliada */}
  {isImageZoomed && (
    <div 
      onClick={() => setIsImageZoomed(false)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        cursor: 'zoom-out',
        padding: '20px'
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsImageZoomed(false);
        }}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 255, 255, 0.95)',
          border: 'none',
          borderRadius: '50%',
          width: '45px',
          height: '45px',
          fontSize: '24px',
          cursor: 'pointer',
          fontWeight: 'bold',
          color: '#333',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          zIndex: 10000
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#fff';
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.95)';
          e.target.style.transform = 'scale(1)';
        }}
      >
        ✕
      </button>
      <img 
        src={selectedImage} 
        alt={product.title}
        style={{
          maxWidth: '100%',
          maxHeight: '90vh',
          objectFit: 'contain',
          borderRadius: '8px'
        }}
      />
    </div>
  )}
</Container>
    </>
  );
}
