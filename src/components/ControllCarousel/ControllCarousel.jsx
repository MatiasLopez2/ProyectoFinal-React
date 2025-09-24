import Carousel from "react-bootstrap/Carousel";
import stanley from "/img/bannerStanley.jpg"; 
import bannerBosch from "/img/bannerBosch.jpg"; 
import bannerskil from "/img/banner_skil.jpg"; 
import bannerdewalt from "/img/banner_dewalt.jpg"; 
import './ControllCarousel.css'

function ControllCarousel() {
  return (
    <Carousel>
      <Carousel.Item>
        <img className="d-block w-100 imgCarousel" src={stanley} alt="First slide" />
        <Carousel.Caption>
          <h3>STANLEY</h3>
          <p>Marca con más de 175 años de experiencia. Sus herramientas se destacan por la resistencia, ergonomía y buena relación precio-calidad, ideales para bricolaje y uso profesional.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img className="d-block w-100 imgCarousel" src={bannerBosch} alt="Second slide" />
        <Carousel.Caption>
          <h3>BOSCH</h3>
          <p>Tecnología alemana reconocida por su precisión, potencia y seguridad. Ofrece herramientas de alto rendimiento tanto para el hogar como para la industria.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img className="d-block w-100 imgCarousel" src={bannerskil} alt="Third slide" />
        <Carousel.Caption>
          <h3>SKIL</h3>
          <p>Prácticas y accesibles, las herramientas Skil combinan ligereza y versatilidad. Son perfectas para bricolaje y proyectos semi-profesionales.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img className="d-block w-100 imgCarousel" src={bannerdewalt} alt="Third slide" />
        <Carousel.Caption>
          <h3>DEWALT</h3>
          <p>Especialista en herramientas robustas y de alto desempeño. Muy valorada en construcción e industria por su durabilidad y confiabilidad.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default ControllCarousel;
