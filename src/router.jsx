import FrontendLayout from "./layout/FrontendLayout";
import Cart from "./views/front/Cart";
import Checkout from "./views/front/Checkout";
import Home from "./views/front/Home";
import Login from "./views/front/Login";
import NotFound from "./views/front/NotFound";
import Products from "./views/front/Products";
import SingleProduct from "./views/front/SingleProduct";

const routes = [
  {
    path: "/",
    element: <FrontendLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "product",
        element: <Products />,
      },
      {
        path: "product/:id",
        element: <SingleProduct />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
