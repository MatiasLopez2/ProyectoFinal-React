import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './Grid.css'

import bannerStanley from "/img/bannerStanley.jpg";
import bannerBosch from "/img/bannerBosch.jpg";
import bannerskil from "/img/banner_skil.jpg";
import bannerdewalt from "/img/banner_dewalt.jpg";

const cardsData = [
  { img: bannerStanley, title: "STANLEY", text: "Stanley es una de las marcas más reconocidas a nivel mundial en herramientas manuales y eléctricas. Con más de 175 años de trayectoria, se destaca por ofrecer productos confiables, duraderos y pensados tanto para profesionales como para aficionados al bricolaje. Sus herramientas combinan diseño ergonómico, resistencia y precisión, siendo la elección ideal para quienes buscan calidad al mejor precio en trabajos de construcción, carpintería y mantenimiento general.", link: "/brand/stanley" },
  { img: bannerBosch, title: "BOSCH", text: "Bosch es sinónimo de innovación y tecnología alemana. La marca ha construido una sólida reputación gracias a la potencia, precisión y eficiencia de sus herramientas eléctricas. Sus productos están orientados tanto a profesionales de la construcción e industria como a usuarios exigentes en el hogar. Además, Bosch invierte constantemente en sistemas de seguridad y soluciones sostenibles, ofreciendo herramientas de alto rendimiento que garantizan confiabilidad en cada proyecto.", link: "/brand/bosch" },
  { img: bannerskil, title: "SKIL", text: "Skil es una marca práctica y accesible que ofrece herramientas diseñadas para quienes buscan facilidad de uso sin resignar potencia ni calidad. Reconocida por haber creado la primera sierra circular portátil, Skil combina décadas de experiencia con soluciones modernas para trabajos de carpintería, bricolaje y remodelación. Sus productos se destacan por la ligereza, ergonomía y versatilidad, siendo la elección ideal para proyectos domésticos y semi-profesionales.", link: "/brand/skil" },
  { img: bannerdewalt, title: "DEWALT", text: "DeWalt es referente global en herramientas eléctricas y a batería para profesionales exigentes. Con un enfoque en potencia, resistencia y productividad, la marca es especialmente valorada en construcción, carpintería pesada y entornos industriales. Sus herramientas destacan por soportar condiciones extremas de trabajo, manteniendo un rendimiento constante y confiable. DeWalt representa durabilidad y alto desempeño, convirtiéndose en un aliado indispensable en proyectos de gran envergadura.", link: "/brand/dewalt" },
];

function Grid() {
  return (
    <Row xs={1} md={2} className="g-4">
      {cardsData.map((card, idx) => (
        <Col key={idx}>
          <Link to={card.link} style={{ textDecoration: "none", color: "inherit" }}>
            <Card style={{ height: "100%" }}>
              <Card.Img variant="top" src={card.img} />
              <Card.Body>
                <Card.Title>{card.title}</Card.Title>
                <Card.Text>{card.text}</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );
}

export default Grid;
