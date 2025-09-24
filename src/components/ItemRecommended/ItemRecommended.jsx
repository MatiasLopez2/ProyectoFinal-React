
import Card from 'react-bootstrap/Card';
import './ItemRecommended.css'
import { useNavigate } from "react-router-dom";

function ItemRecommended(props) {
  const navigate = useNavigate();
  return (
     <Card style={{ width: "100%", cursor: "pointer" }} onClick={() => navigate(`/itemdetail/${props.id}`)}>
        <Card.Img src={props.img[0]} alt={props.title} style={{ objectFit: "cover", height: "200px" }} />
        <Card.Body>
          <Card.Title>{props.title}</Card.Title>
          <Card.Text>${props.price}</Card.Text>
        </Card.Body>
      </Card>
  )
}

export default ItemRecommended;
