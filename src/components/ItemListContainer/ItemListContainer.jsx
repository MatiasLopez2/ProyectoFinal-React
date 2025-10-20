import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProducts, getProductByCategory } from "../../data/firebase";
import Pagination from "../Pagination/Pagination"; 
import ItemList from "../ItemList/ItemList"; 
import "./ItemListContainer.css";

export default function ItemListContainer() {
  const { categParam, brandParam } = useParams();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        let data;
        if (categParam) {
          data = await getProductByCategory(categParam);
        } else {
          data = await getProducts();
        }
        setProducts(data);
        setCurrentPage(1);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categParam, brandParam]);

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filtered = products.filter((p) =>
    brandParam ? p.brand === brandParam : true
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filtered.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  let pageTitle = "Todos los productos";
  if (categParam) pageTitle = `${categParam}`;
  if (brandParam) pageTitle = `${brandParam}`;

  return (
    <div className="category">
      <h2 style={{ marginBottom: "20px", textTransform: "capitalize" }}>
        {pageTitle}
      </h2>

      <ItemList products={currentProducts} />

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
