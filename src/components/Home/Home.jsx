import ControllCarousel from '../ControllCarousel/ControllCarousel';
import ItemRecommended from '../ItemRecommended/ItemRecommended';
import Brands from '../Brands/Brands';
import Services from '../Services/Services';
import Grid from '../Grid/Grid';
import PayMethods from '../PayMethods/PayMethods';
import { getProducts } from '../../data/firebase';

import 'swiper/css';
import 'swiper/css/navigation';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home(){
  const [products, setProducts] = useState([]);


  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(err => console.error("Error al cargar productos:", err));
  }, []);

  const featured = products.filter(product => product.featured);

  return(
    <>
      <ControllCarousel />

      <div>
        <h3 className='section-title'>PRODUCTOS EN OFERTA</h3>
      </div>

      {featured.length > 0 && (
        <Swiper
          key={featured.length} 
          modules={[Navigation]}
          spaceBetween={15}
          navigation
          loop={featured.length > 4} 
          autoHeight={true}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 10 },
            576: { slidesPerView: 1.5, spaceBetween: 10 },
            768: { slidesPerView: 2.2, spaceBetween: 15 },
            992: { slidesPerView: 3, spaceBetween: 15 },
            1200: { slidesPerView: 3.5, spaceBetween: 15 },
            1440: { slidesPerView: 6, spaceBetween: 20 },
          }}
        >
          {featured.map((prod) => (
            <SwiperSlide key={prod.id}>
              <motion.div
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link to={`/itemdetail/${prod.id}`} className="block">
                  <ItemRecommended {...prod} />
                </Link>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}


      <Brands />
      <h3 className='section-title'>CATEGORIAS RECOMENDADAS</h3>
      <Grid />
      <PayMethods />
      <Services />
    </>
  )
}
