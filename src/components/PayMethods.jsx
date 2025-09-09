import "./PayMethods.css";

// Array de logos de pago
const paymentLogos = [
  { src: "/img/visa@2x.png", alt: "Visa" },
  { src: "/img/mastercard@2x.png", alt: "Mastercard" },
  { src: "/img/amex@2x.png", alt: "Amex" },
  { src: "/img/cabal@2x.png", alt: "Cabal" },
  { src: "/img/tarjeta-naranja@2x.png", alt: "Tarjeta Naranja" },
  { src: "/img/maestro@2x.png", alt: "Maestro" },
  { src: "/img/visadebit@2x.png", alt: "Visa Debit" },
  { src: "/img/pagofacil@2x.png", alt: "Pago Fácil" },
  { src: "/img/rapipago@2x.png", alt: "Rapipago" },
];

// Array de logos de envío
const shippingLogos = [
  { src: "/img/2682@2x.png", alt: "Shipping 2682" },
  { src: "/img/6053@2x.png", alt: "Shipping 6053" },
  { src: "/img/3336@2x.png", alt: "Shipping 3336" },
];

const PayMethods = () => {
  return (

     <section className="payment-shipping-section">
      <div className="container">
        <div className="section-block">
          <h4>Medios de pago</h4>
          <div className="logos">
            {paymentLogos.map((logo, index) => (
               <img key={index} src={logo.src} alt={logo.alt} className="logo-item" />
             ))}
          </div>
        </div>
        <div className="section-block">
          <h4>Envíos</h4>
          <div className="logos">
            {shippingLogos.map((logo, index) => (
               <img key={index} src={logo.src} alt={logo.alt} className="logo-item" />
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PayMethods;
