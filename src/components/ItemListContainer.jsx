import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './ItemListContainer.css'
import { useState } from "react";

function ItemListContainer(props){

    const onAddToCart = props.onAddToCart;
    const [state, setState] = useState("Agregar al Carrito");
    const [ColorBackground,setColorBackground] = useState("#blue");


    function addtoCart(){      
        setState("Producto Agregado");
        setColorBackground("#0e8916");
        if (onAddToCart) onAddToCart();
    }

    return(
        <Card style={{ width: "100%" }}>
      <Card.Img variant="top" style={{ minHeight: "150px", maxHeight: "200px", objectFit: "contain" }}  src={props.img} />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>{props.description}</Card.Text>
        <Card.Text>${props.price}</Card.Text>
        <Button onClick={ addtoCart } style={ {backgroundColor: ColorBackground} }  variant="primary">{state}</Button>
      </Card.Body>
    </Card>
    )
}

export default ItemListContainer;