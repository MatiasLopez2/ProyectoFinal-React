import stanley from "/img/stanley.png"
import dewalt from "/img/dewalt.png"
import black from "/img/black.png"
import bosch from "/img/bosch.png"
import makita from "/img/makita.png"
import milwaukee from "/img/milwaukee.png"
import skil from "/img/skil.png"
import { Link } from "react-router-dom";
import './Brands.css';

function Brands(){
    const brands = [
      { name: 'Stanley', img: stanley, link: '/brand/stanley' },
      { name: 'Dewalt', img: dewalt, link: '/brand/dewalt' },
      { name: 'Black+Decker', img: black, link: '/brand/black+decker' },
      { name: 'Bosch', img: bosch, link: '/brand/bosch' },
      { name: 'Makita', img: makita, link: '/brand/makita' },
      { name: 'Milwaukee', img: milwaukee, link: '/brand/milwaukee' },
      { name: 'Skil', img: skil, link: '/brand/skil' },
    ];

    return(
        <>
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h3 className='section-title'>ENCONTRÁ TU MARCA</h3>
      <div className="brands-grid">
        {brands.map((brand, index) => (
          <Link 
            key={index} 
            to={brand.link}
            className="brand-item"
          >
            <img 
              src={brand.img} 
              alt={brand.name}
              style={{ 
                width: '100%',
                maxWidth: '120px',
                height: 'auto',
                objectFit: 'contain'
              }} 
              loading="lazy" 
            />
          </Link>
        ))}
      </div>
    </div>
        </>
    )
}

export default Brands;