import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
} from "lucide-react";
import "./Footer.css";
import { Link } from 'react-router-dom'; 


function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">        
        
        <div className="footer-col">
          <h4>Cómo comprar</h4>
          <ul className="footer-menu">
            <li>
             <Link to="/terms" >
                Términos & Condiciones
              </Link>
            </li>
            <li>
               <Link to="/how-to-buy" >
                Cómo Comprar
              </Link>
            </li>
            <li>
              <Link to="/policy" >
                Política de Devoluciones
              </Link>
            </li>
            
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contactános</h4>
          <ul className="contact-info">
            <li>
              <Link to="/contact" >Contacto</Link>
            </li>
            <li>
              <MessageCircle size={18} />{" "}
              <a href="https://wa.me/542235110170" target="_blank">2235110170</a>
            </li>
            
            <li>
              <Mail size={18} />{" "}
              <Link to="/contact" >
                lacasadelatuerca@gmail.com
              </Link>
            </li>
            <li>
              <MapPin size={18} /> Av. Juan B. Justo 2222, Mar del Plata, Buenos Aires
            </li>
          </ul>
        </div>


        <div className="footer-col">
          <h4>Nuestra comunidad</h4>
          <div className="social-icons">
            <a
              href="https://instagram.com/lacasadelatuerca"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={22} />
            </a>
            <a
              href="https://wa.me/542235110170"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={22} />
            </a>
            
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
