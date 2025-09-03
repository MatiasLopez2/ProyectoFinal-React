import { ShoppingCart } from 'lucide-react';
import './CartWidget.css';

// const count = 1;

function CartWidget ({ count }) {
    return (
      <div className="fixed top-4 right-4">
      <button className="relative buttonShop">
        <ShoppingCart className="w-8 h-8" />
       
      </button>
      <div className="notification">
        
       {count > 0 && (
           <span className="absolute -top-2 -right-2 bg-blue-600 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
            {count}
          </span>
        )}
        </div>
    </div>
    )
}


export default CartWidget;