import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";

export default function ItemList({ products }) {
  if (products.length === 0) {
    return <p>No hay productos para mostrar.</p>;
  }

  return (
    <div className="products-list">
      {products.map((p) => (
        <Link
          key={p.id}
          to={`/itemdetail/${p.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Card style={{ width: "18rem" }}>
            <Card.Img
              variant="top"
              src={p.img[0]}
              alt={p.title}
              style={{
                minHeight: "150px",
                maxHeight: "200px",
                objectFit: "contain",
              }}
            />
            <Card.Body>
              <Card.Title>{p.title}</Card.Title>
              <Card.Text>${p.price}</Card.Text>
            </Card.Body>
          </Card>
        </Link>
      ))}
    </div>
  );
}
