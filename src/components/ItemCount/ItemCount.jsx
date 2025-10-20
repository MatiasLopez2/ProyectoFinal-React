import { Button, Form } from "react-bootstrap";

export default function ItemCount({ quantity, setQuantity }) {
  return (
    <div className="d-flex align-items-center mb-3">
      <Button
        variant="outline-secondary"
        onClick={() => setQuantity(q => Math.max(1, q - 1))}
      >
        –
      </Button>

      <Form.Control
        type="number"
        value={quantity}
        readOnly
        className="mx-2 text-center"
        style={{ width: "70px" }}
      />

      <Button
        variant="outline-secondary"
        onClick={() => setQuantity(q => Math.min(q + 1))}
      >
        +
      </Button>
    </div>
  );
}
