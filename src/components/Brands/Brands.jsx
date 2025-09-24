import stanley from "/img/stanley.png"
import dewalt from "/img/dewalt.png"
import black from "/img/black.png"
import bosch from "/img/bosch.png"
import makita from "/img/makita.png"
import milwaukee from "/img/milwaukee.png"
import skil from "/img/skil.png"
import { Link } from "react-router-dom";

function Brands(){
    return(
        <>
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h3 className='section-title'>ENCONTRÁ TU MARCA</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
        
          <a href="" className="transition-transform hover:scale-30">
            <picture>
              <Link to="/brand/stanley"><img src={stanley} style={{ width: '150px' }}  className="h-12 object-contain" loading="lazy" /></Link>
              <Link to="/brand/dewalt"><img src={dewalt} style={{ width: '150px' }}  className="h-12 object-contain" loading="lazy" /></Link>
              <Link to="/brand/black+decker"><img src={black} style={{ width: '150px' }}  className="h-12 object-contain" loading="lazy" /></Link>
              <Link to="/brand/bosch"><img src={bosch} style={{ width: '150px' }}  className="h-12 object-contain" loading="lazy" /></Link>
              <Link to="/brand/makita"><img src={makita} style={{ width: '150px' }}  className="h-12 object-contain" loading="lazy" /></Link>
              <Link to="/brand/milwaukee"><img src={milwaukee} style={{ width: '150px' }}  className="h-12 object-contain" loading="lazy" /></Link>
              <Link to="/brand/skil"><img src={skil} style={{ width: '150px' }}  className="h-12 object-contain" loading="lazy" /></Link>
            </picture>
          </a>
       
      </div>
    </div>
        </>
    )
}

export default Brands;