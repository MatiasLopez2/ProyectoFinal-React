import "./Services.css";
import { Truck, CreditCard, Home, CreditCardIcon } from "lucide-react";

const servicesData = [
  {
    id: 1,
    icon: Truck,
    title: "Envíos a todo el país",
    description: "Acercamos tu producto donde estés",
  },
  {
    id: 2,
    icon: CreditCard,
    title: "Todas las tarjetas",
    description:
      "A través de Mercado Pago, podés elegir pagar hasta con 2 tarjetas",
  },
  {
    id: 3,
    icon: CreditCardIcon,
    title: "Comprá en 3 cuotas sin intereses",
    description:
      "Tenés que elegir la opción de Mercado Pago. Aplica a tarjetas bancarizadas",
  },
  {
    id: 4,
    icon: Home,
    title: "Horario Sucursal",
    description:
      "Lun a Vie 9 a 13 - 14 a 17.30. Sábados de 9 a 13hs",
  },
];

function Services() {
  return (
    <section className="services">
      <div className="services-container">
        {servicesData.map((service) => {
          const Icon = service.icon; // acá usamos el componente
          return (
            <div key={service.id} className="service-card">
              <div className="service-icon">
                <Icon size={40} strokeWidth={1.5} />
              </div>
              <div className="service-info">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Services;
