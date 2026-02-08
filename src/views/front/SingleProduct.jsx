import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState({});

  const addCart = async (id) => {
    const data = {
      product_id: id,
      qty: 1,
    };
    try {
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, { data });
      console.log(response.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
        setProduct(response.data.product);
        console.log(response.data.product);
        console.log("product:", product);
      } catch (error) {
        console.log(error.response);
      }
    };
    getSingleProduct();
  }, [id, product]);
  if (!product)
    return (
      <>
        <h2 className="h2">查無產品</h2>
      </>
    );
  return (
    <>
      <div className="col-md-4 mb-3" key={product.id}>
        <div className="card">
          <img src={product.imageUrl} className="card-img-top" alt={product.title} />
          <div className="card-body">
            <h5 className="card-title">{product.title}</h5>
            <p className="card-text">{product.description}</p>
            <p className="card-text">價格: {product.price}</p>
            <p className="card-text">
              <small className="text-body-secondary">{product.unit}</small>
            </p>
            <button type="button" className="btn btn-primary" onClick={() => addCart(product.id)}>
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleProduct;
