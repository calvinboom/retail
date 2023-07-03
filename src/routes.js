import { Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./views/login";
import Shop from "./views/shop";

const routes = (currentUser) => [
    {
        path: "app",
        element: currentUser ? <DashboardLayout /> : <Navigate to="/login" />,
        children: [
            { path: "", element: currentUser ? <Navigate to="/app/shop" /> : <Navigate to="404" /> },
            { path: "shop", element: currentUser ? <Shop /> : <Navigate to="404" /> },
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
