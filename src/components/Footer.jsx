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

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">        
        
        <div className="footer-col">
          <h4>Cómo comprar</h4>
          <ul className="footer-menu">
            <li>
              <a href="">
                Términos & Condiciones
              </a>
            </li>
            <li>
              <a href="">
                Cómo Comprar
              </a>
            </li>
            <li>
              <a href="">
                Política de Devoluciones
              </a>
            </li>
            
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contactános</h4>
          <ul className="contact-info">
            <li>
              <a href="/contacto/">Contacto</a>
            </li>
            <li>
              <MessageCircle size={18} />{" "}
              <a href="https://wa.me/54223">223</a>
            </li>
            
            <li>
              <Mail size={18} />{" "}
              <a href="mailto:lacasadelatuerca@gmail.com">
                lacasadelatuerca@gmail.com
              </a>
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
              href="https://wa.me/54223"
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
