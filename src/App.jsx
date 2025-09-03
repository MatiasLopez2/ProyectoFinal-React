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

// productos
import caladora from "./assets/img/caladora.jpg";
import amoladoraAngular from "./assets/img/amoladoraAngular.jpg";
import lijadoraSkil from "./assets/img/lijadoraSkil.jpg";
import lijadoraSTEL401 from "./assets/img/lijadoraSTEL401.jpg";
import sierraCircular from "./assets/img/SierraCircular.jpg";
import sierraCircular2 from "./assets/img/SierraCircular2.jpg";

// Array de productos
const productos = [
  { title: "Caladora 500w", price: 1000, img: caladora },
  { title: "Amoladora Angular 830W SKIL", price: 58000, img: amoladoraAngular },
  { title: "Lijadora Orbital 200W SKIL", price: 60000, img: lijadoraSkil },
  { title: "Lijadora Orbital 220W STANLEY", price: 4000, img: lijadoraSTEL401 },
  { title: "Sierra Circular 1700W STANLEY", price: 92000, img: sierraCircular },
  { title: "Sierra Circular 1400W SKIL", price: 78000, img: sierraCircular2 },
  { title: "Caladora 800w", price: 7000, img: caladora },
];


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
        {productos.map((prod, index) => (
          <SwiperSlide key={`item-${index}`}>
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