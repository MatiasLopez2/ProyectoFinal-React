import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './Grid.css'

import bannerStanley from "/img/bannerStanley.jpg";
import bannerBosch from "/img/bannerBosch.jpg";
import bannerskil from "/img/banner_skil.jpg";
import cat4 from "/img/cat1.jpg";

const cardsData = [
  { img: bannerStanley, title: "Categoria 1", text: "Descripcion de la Categoria." },
  { img: bannerBosch, title: "Categoria 2", text: "Descripcion de la Categoria." },
  { img: bannerskil, title: "Categoria 3", text: "Descripcion de la Categoria." },
  { img: cat4, title: "Categoria 4", text: "Descripcion de la Categoria." },
];

function Grid() {
  return (
    <Row xs={1} md={2} className="g-4">
      {cardsData.map((card, idx) => (
        <Col key={idx}>
          <Card style={{ height: "100%" }}>
            <Card.Img variant="top" src={card.img} />
            <Card.Body>
              <Card.Title>{card.title}</Card.Title>
              <Card.Text>{card.text}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default Grid;
