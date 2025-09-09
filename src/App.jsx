import './App.css'
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { motion } from "framer-motion";

import NavBar from './components/NavBar'
import ControllCarousel from './components/ControllCarousel';
import ItemListContainer from './components/ItemListContainer';
import Brands from './components/Brands';
import Services from './components/services';
import Grid from './components/Grid';
import Footer from './components/Footer';
import PayMethods from './components/PayMethods';
import products from './data/products';



function App() {

  const [cartCount, setCartCount] = useState(0);

  // función que pasaremos a los hijos
  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };


  return (
    <>
      <NavBar cartCount={cartCount}/>
      <ControllCarousel />

      <div>
        <h3 className='section-title'>PRODUCTOS EN OFERTA</h3>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        navigation
        loop={true}
        loopFillGroupWithBlank={false}
        breakpoints={{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 3 },
          1440: { slidesPerView: 5 },
        }}
      >
        {products.map((prod) => (
          <SwiperSlide key={`item-${prod.id}`}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ItemListContainer
                title={prod.title}
                price={prod.price}
                img={prod.img}
                onAddToCart={handleAddToCart}
              />
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>


      <Brands />


      <h3 className='section-title'>CATEGORIAS RECOMENDADAS</h3>

      <Grid />


      <PayMethods />
      <Services />


      <Footer />


    </>
  );
}

export default App;