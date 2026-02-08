import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Products() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
        console.log(response.data.products);
        setProducts(response.data.products);
      } catch (error) {
        console.log(error.response);
      }
    };
    getProducts();
  }, []);

  return (
    <>
      <div className="container">
        <div className="row">
          {/* 不用手動return */}
          {products.map((item) => (
            <div className="col-md-4 mb-3" key={item.id}>
              <div className="card">
                <img src={item.imageUrl} className="card-img-top" alt={item.title} />
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">{item.description}</p>
                  <p className="card-text">價格: {item.price}</p>
                  <p className="card-text">
                    <small className="text-body-secondary">{item.unit}</small>
                  </p>
                  <NavLink className="btn btn-primary" to={`/product/${item.id}`}>
                    查看更多
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Products;
