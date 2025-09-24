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



function App() {
 
  return (
    <>
      <BrowserRouter>

      <NavBar/>

      <Routes>
        <Route path="/" element={ <Home></Home> } />
        <Route path="/category/:categParam" greeting="Categoria" element={ <div class="category"><ItemListContainer></ItemListContainer></div> } />
        <Route path="/brand/:brandParam" greeting="Marcas" element={ <div class="category"><ItemListContainer></ItemListContainer></div> } />
        <Route path="/itemdetail/:idParam" element={ <ItemDetailContainer></ItemDetailContainer> } />
        <Route path="*" element={<NotFound></NotFound>} />
        {/* <Route path="/cart" element={<Cart></Cart>} /> */}
      </Routes>

      <Footer />

    </BrowserRouter>
    </>
  );
}

export default App;