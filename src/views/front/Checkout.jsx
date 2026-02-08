import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { currency } from "../../utils/filter";
import { useForm } from "react-hook-form";
import { ThreeDots, Oval, Puff, RotatingLines } from "react-loader-spinner";
import * as bootstrap from "bootstrap";
import SingleProductModal from "../../components/SingleProductModal";
import { emailValidation } from "../../utils/validation";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Checkout() {
  const [cart, setCart] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  // 載入狀態
  const [loadingCartId, setLoadingCartId] = useState(null);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const productModalRef = useRef(null);

  const addCart = async (id, qty) => {
    const data = {
      product_id: id,
      qty: qty,
    };
    //設定Loading狀態
    setLoadingCartId(id);
    try {
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, { data });
      console.log(response.data);
      getCart();
    } catch (error) {
      console.log(error.response);
    } finally {
      //清除Loading狀態
      setLoadingCartId(null);
    }
  };

  const getSingleProduct = async (id) => {
    setLoadingProductId(id);
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
      setProduct(response.data.product);
      console.log(response.data.product);
      console.log("product:", product);
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoadingProductId(null);
    }
    openModal();
  };

  const onSubmit = async (formData) => {
    try {
      const data = {
        user: {
          name: formData.name,
          email: formData.email,
          tel: formData.tel,
          address: formData.address,
        },
        message: formData.message,
      };
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/order`, { data: data });
      console.log(response.data.message);
      getCart();
    } catch (error) {
      console.log(error.response);
    }
  };

  const getCart = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      console.log(response.data.data);
      setCart(response.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };
  const getProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
      console.log(response.data.products);
      setProducts(response.data.products);
    } catch (error) {
      console.log(error.response);
    }
  };
  useEffect(() => {
    //初始化  綁定Modal 關閉鍵盤esc 關閉Modal功能
    productModalRef.current = new bootstrap.Modal("#productModal", { keybpard: false });

    // Modal 關閉時移除焦點
    document.querySelector("#productModal").addEventListener("hide.bs.modal", () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });

    //畫面初始化 - 取得購物車列表和產品列表
    (async () => {
      try {
        await getCart();
        await getProducts();
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
  const openModal = () => {
    productModalRef.current.show();
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };

  return (
    <>
      <div className="container">
        {/* 產品列表 */}
        <table className="table align-middle">
          <thead>
            <tr>
              <th>圖片</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id}>
                <td style={{ width: "200px" }}>
                  <div
                    style={{
                      height: "100px",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundImage: `url(${item.imageUrl})`,
                    }}></div>
                </td>
                <td>${item.title}</td>
                <td>
                  <del className="h6">原價：{item.origin_price}</del>
                  <div className="h5">特價：${item.price}</div>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => getSingleProduct(item.id)} disabled={loadingProductId === item.id}>
                      {loadingProductId === item.id ? <RotatingLines color="gray" width={56} height={21} /> : "查看更多"}
                    </button>
                    <button type="button" className="btn btn-outline-danger" onClick={() => addCart(item.id, 1)} disabled={loadingCartId === item.id}>
                      {loadingCartId === item.id ? <RotatingLines color="gray" width={70} height={21} /> : "加到購物車"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                      <input type="number" className="form-control text-center fw-bold" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" defaultValue={item.qty} onChange={(e) => updateUnit(item.id, item.product_id, Number(e.target.value))} />
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
        {/* 結帳頁面 */}
        <div className="my-5 row justify-content-center">
          <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input id="email" name="email" type="email" className="form-control" placeholder="請輸入 Email" {...register("email", emailValidation)} />
              {errors.email && <p className="text-danger">{errors.email.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                收件人姓名
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-control"
                placeholder="請輸入姓名"
                {...register("name", {
                  required: "請輸入姓名",
                  minLength: {
                    value: 2,
                    message: "姓名最少 2 個字",
                  },
                })}
              />
              {errors.name && <p className="text-danger">{errors.name.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="tel" className="form-label">
                收件人電話
              </label>
              <input
                id="tel"
                name="tel"
                type="tel"
                className="form-control"
                placeholder="請輸入電話"
                {...register("tel", {
                  required: "請輸入電話",
                  pattern: {
                    value: /^\d+$/,
                    message: "電話僅能輸入數字",
                  },
                  minLength: {
                    value: 8,
                    message: "電話至少 8 碼",
                  },
                })}
              />
              {errors.tel && <p className="text-danger">{errors.tel.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                收件人地址
              </label>
              <input id="address" name="address" type="text" className="form-control" placeholder="請輸入地址" {...register("address", { required: "請輸入地址" })} />
              {errors.address && <p className="text-danger">{errors.address.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                留言
              </label>
              <textarea id="message" className="form-control" cols="30" rows="10" {...register("message")}></textarea>
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-danger">
                送出訂單
              </button>
            </div>
          </form>
        </div>
      </div>
      <SingleProductModal product={product} addCart={addCart} closeModal={closeModal} />
    </>
  );
}

export default Checkout;
