import './App.css'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { BrowserRouter, Route, Routes } from 'react-router';
import NavBar from './components/NavBar/NavBar'
import Footer from './components/Footer/Footer';
import ItemDetailContainer from './components/ItemDetailContainer/ItemDetailContainer';
import Home from './components/Home/Home'
import ItemListContainer from './components/ItemListContainer/ItemListContainer';
import NotFound from "./components/NotFound/NotFound";
import { CartContextProvider } from './context/cartContext';
import CartContainer from './components/CartContainer/CartContainer';
import FormCheckout from './components/CartContainer/FormCheckout';
import ThankYou from "./components/ThankYou/ThankYou";
import Policy from "./components/Policy/Policy"
import Terms from "./components/Policy/Terms"
import HowToBuy from "./components/Policy/HowToBuy"
import Contact from "./components/Contact/Contact"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
    <CartContextProvider>      
      <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path="/" element={ <Home></Home> } />
          <Route path="/category/:categParam" greeting="Categoria" element={ <div className="category"><ItemListContainer></ItemListContainer></div> } />
          <Route path="/brand/:brandParam" greeting="Marcas" element={ <div className="category"><ItemListContainer></ItemListContainer></div> } />
          <Route path="/itemdetail/:idParam" element={ <ItemDetailContainer></ItemDetailContainer> } />
          <Route path="*" element={<NotFound></NotFound>} />
          <Route path="/cart" element={<CartContainer></CartContainer>} />
          <Route path="/FormCheckout" element={<FormCheckout></FormCheckout>} />
          <Route path="/thankyou/:orderId" element={<ThankYou />} />
          <Route path="/policy" element={<Policy></Policy>} />
          <Route path="/terms" element={<Terms></Terms>} />
          <Route path="/how-to-buy" element={<HowToBuy></HowToBuy>} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </BrowserRouter>
    </CartContextProvider>
    </>
  );
}

export default App;