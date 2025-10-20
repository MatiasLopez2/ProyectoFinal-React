import { ShoppingCart } from 'lucide-react';
import './CartWidget.css';
import { Link } from 'react-router-dom'; 
import { useContext } from 'react';
import cartContext from '../../context/cartContext';

function CartWidget () {
  const {countItems} = useContext(cartContext);
    return (
      <div className="fixed top-4 right-4">
        <Link to="/cart" >
      <button className="relative buttonShop">
        <ShoppingCart className="w-8 h-8" />
       
      </button>
      </Link>
      <div className="notification">        
       
        <span className="absolute -top-2 -right-2 bg-blue-600 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
          {countItems()}
        </span>
        
      </div>
    </div>
    )
}


export default CartWidget;