import "./PayMethods.css";

// Array de logos de pago
const paymentLogos = [
  { src: "./src/assets/img/visa@2x.png", alt: "Visa" },
  { src: "./src/assets/img/mastercard@2x.png", alt: "Mastercard" },
  { src: "./src/assets/img/amex@2x.png", alt: "Amex" },
  { src: "./src/assets/img/cabal@2x.png", alt: "Cabal" },
  { src: "./src/assets/img/tarjeta-naranja@2x.png", alt: "Tarjeta Naranja" },
  { src: "./src/assets/img/maestro@2x.png", alt: "Maestro" },
  { src: "./src/assets/img/visadebit@2x.png", alt: "Visa Debit" },
  { src: "./src/assets/img/pagofacil@2x.png", alt: "Pago Fácil" },
  { src: "./src/assets/img/rapipago@2x.png", alt: "Rapipago" },
];

// Array de logos de envío
const shippingLogos = [
  { src: "./src/assets/img/2682@2x.png", alt: "Shipping 2682" },
  { src: "./src/assets/img/6053@2x.png", alt: "Shipping 6053" },
  { src: "./src/assets/img/3336@2x.png", alt: "Shipping 3336" },
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
