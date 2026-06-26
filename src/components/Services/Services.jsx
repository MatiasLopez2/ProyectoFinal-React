import "./Services.css";
import { Truck, CreditCard, Home, CreditCardIcon } from "lucide-react";

const servicesData = [
  {
    id: 1,
    icon: CreditCard,
    title: "Métodos de pago",
    description: "Transferencia bancaria o efectivo en sucursal",
  },
  {
    id: 2,
    icon: Home,
    title: "Horario Atención",
    description: "Lunes a Viernes de 8-17 hs.\nSábados de 8-12.30 hs",
  },
];

function Services() {
  return (
    <section className="services">
      <div className="services-container">
        {servicesData.map((service) => {
          const Icon = service.icon; 
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
