import { useEffect, useState } from "react";
import axios from "axios";
import { currency } from "../../utils/filter";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Cart() {
  const [cart, setCart] = useState([]);

  const getCart = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      console.log(response.data.data);
      setCart(response.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        await getCart();
      } catch (error) {
        console.log(error.response);
      }
    })();
  }, []);
  //qty沒寫預設為1
  const updateUnit = async (cartId, productId, qty = 1) => {
    try {
      const data = {
        product_id: productId,
        qty: qty,
      };
      const response = await axios.put(`${API_BASE}/api/${API_PATH}/cart/${cartId}`, { data });
      console.log(response.data);
      getCart();
    } catch (error) {
      console.log(error.response);
    }
  };
  const deleteUnit = async (cartId) => {
    try {
      const response = await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${cartId}`);
      console.log(response.data);
      getCart();
    } catch (error) {
      console.log(error.response);
    }
  };
  const deleteAll = async () => {
    try {
      const response = await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      console.log(response.data);
      getCart();
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <>
      <div className="container">
        <h2>購物車列表</h2>
        <div className="text-end mt-4">
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => {
              deleteAll();
            }}>
            清空購物車
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">品名</th>
              <th scope="col">數量/單位</th>
              <th scope="col">小計</th>
            </tr>
          </thead>
          <tbody>
            {cart?.carts?.map((item) => (
              <tr key={item.id}>
                <td>
                  <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => deleteUnit(item.id)}>
                    刪除
                  </button>
                </td>
                <th scope="row">{item.product.title}</th>
                <td>
                  {
                    <div className="input-group input-group-sm mb-3">
                      <input type="number" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" defaultValue={item.qty} onChange={(e) => updateUnit(item.id, item.product_id, Number(e.target.value))} />
                      <span className="input-group-text" id="inputGroup-sizing-sm">
                        {item.product.unit}
                      </span>
                    </div>
                  }
                </td>
                <td className="text-end">{currency(item.final_total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="text-end" colSpan="3">
                總計
              </td>
              <td className="text-end">{currency(cart.final_total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}

export default Cart;
