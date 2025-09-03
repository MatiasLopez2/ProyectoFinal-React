import Carousel from "react-bootstrap/Carousel";
import stanley from "../assets/img/bannerStanley.jpg"; 
import bannerBosch from "../assets/img/bannerBosch.jpg"; 
import bannerskil from "../assets/img/banner_skil.jpg"; 
import './ControllCarousel.css'

function ControllCarousel() {
  return (
    <Carousel>
      <Carousel.Item>
        <img className="d-block w-100 imgCarousel" src={stanley} alt="First slide" />
        <Carousel.Caption>
          <h3>Herramientas Manuales</h3>
          <p>STANLEY® fabrica herramientas manuales para profesionales y para quienes exigen equipamiento profesional para construir, fabricar, reparar y, a veces, demoler. Herramientas de confianza utilizadas día tras día.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img className="d-block w-100 imgCarousel" src={bannerBosch} alt="Second slide" />
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img className="d-block w-100 imgCarousel" src={bannerskil} alt="Third slide" />
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default ControllCarousel;
