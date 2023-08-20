import { Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./views/login";
import Shop from "./views/shop";
import Transaction from "./views/transaction";
import Main from "./views/main";
import Product from "./views/product";
import ProductCreate from "./views/productCreate";

const routes = (currentUser) => [
    {
        path: "app",
        element: currentUser ? <DashboardLayout /> : <Navigate to="/login" />,
        children: [
            { path: "", element: currentUser ? <Navigate to="/app/main" /> : <Navigate to="404" /> },
            { path: "main", element: currentUser ? <Main /> : <Navigate to="404" /> },
            { path: "shop", element: currentUser ? <Shop /> : <Navigate to="404" /> },
            { path: "transaction", element: currentUser ? <Transaction /> : <Navigate to="404" /> },
            { path: "product", element: currentUser ? <Product /> : <Navigate to="404" /> },
            { path: "product/new", element: currentUser ? <ProductCreate /> : <Navigate to="404" /> },
            { path: "product/info/:id", element: currentUser ? <ProductCreate /> : <Navigate to="404" /> },
        ],
    },
    {
        path: "/",
        children: [
            { path: "", element: currentUser ? <Navigate to="/app/shop" /> : <Login /> },
            { path: "login", element: <Login /> },
        ],
    },
];

export default routes;
