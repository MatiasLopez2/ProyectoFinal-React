import { createContext, useState } from "react";

const cartContext = createContext(null);

//custom Provider
export function CartContextProvider(props){
    const [cartItems, setCartItems] = useState([]);

    function addToCart(newItem, quantity) {
    setCartItems(prevCart => {
        const existingItemIndex = prevCart.findIndex(item => item.id === newItem.id);

        if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            count: updatedCart[existingItemIndex].count + quantity,
        };
        return updatedCart;
        } else {
        return [...prevCart, { ...newItem, count: quantity }];
        }
    });
    }

    function countItems(){
        let quantity= 0;
        cartItems.forEach( item => quantity += item.count );
        return quantity;
    }

    function removeItem(productId) {
        setCartItems(prevCart => {
            const updatedCart = prevCart
            .map(item => {
                if (item.id === productId) {
                
                if (item.count > 1) {
                    return { ...item, count: item.count - 1 };
                }
                
                return null;
                }
                return item;
            })
            .filter(Boolean); 
            return updatedCart;
        });
    }

    function updateQuantity(productId, newQuantity) {
        setCartItems(prevCart =>
            prevCart.map(item =>
            item.id === productId
                ? { ...item, count: Math.max(1, newQuantity) } 
                : item
            )
        );
    }

    function clearCart(){
        setCartItems([])
    }




    return <cartContext.Provider value={ {cart: cartItems, addToCart, countItems, removeItem, updateQuantity, clearCart } }>
        {props.children}
    </cartContext.Provider>
}


export default cartContext;