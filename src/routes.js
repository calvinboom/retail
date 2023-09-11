import { Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./views/login";
import Shop from "./views/shop";
import Transaction from "./views/transaction";
import Main from "./views/main";
import Product from "./views/product";
import ProductCreate from "./views/productCreate";
import ManageUser from "./views/manageUser";
import ManageUserCreate from "./views/manageUserCreate";
import ManageSeller from "./views/manageSeller";
import ManageSellerCreate from "./views/manageSellerCreate";
import ManageCustomer from "./views/manageCustomer";
import ManageCustomerCreate from "./views/manageCustomerCreate";

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
            { path: "manage-user", element: currentUser ? <ManageUser /> : <Navigate to="404" /> },
            { path: "manage-user/new", element: currentUser ? <ManageUserCreate /> : <Navigate to="404" /> },
            { path: "manage-user/info/:id", element: currentUser ? <ManageUserCreate /> : <Navigate to="404" /> },
            { path: "manage-seller", element: currentUser ? <ManageSeller /> : <Navigate to="404" /> },
            { path: "manage-seller/new", element: currentUser ? <ManageSellerCreate /> : <Navigate to="404" /> },
            { path: "manage-seller/info/:id", element: currentUser ? <ManageSellerCreate /> : <Navigate to="404" /> },
            { path: "manage-customer", element: currentUser ? <ManageCustomer /> : <Navigate to="404" /> },
            { path: "manage-customer/new", element: currentUser ? <ManageCustomerCreate /> : <Navigate to="404" /> },
            { path: "manage-customer/info/:id", element: currentUser ? <ManageCustomerCreate /> : <Navigate to="404" /> },
        ],
    },
    {
        path: "/",
        children: [
            { path: "", element: currentUser ? <Navigate to="/app/main" /> : <Login /> },
            { path: "login", element: <Login /> },
        ],
    },
];

export default routes;
