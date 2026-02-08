import { NavLink, Outlet } from "react-router";

function FrontendLayout() {
  return (
    <>
      <header className="container">
        <ul className="nav">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              首頁
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/product">
              產品列表
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/cart">
              購物車
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/checkout">
              結帳
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/login">
              登入
            </NavLink>
          </li>
        </ul>
      </header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
}

export default FrontendLayout;
