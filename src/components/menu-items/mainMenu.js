// assets
import { PieChart as PieChartIcon, MessageSquare as MessageSquareIcon, ShoppingBag as ShoppingBagIcon, Package as PackageIcon } from "react-feather";

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const main = [
    {
        href: "/app/main",
        icon: PieChartIcon,
        title: "หน้าหลัก",
    },
    {
        href: "/app/shop",
        icon: ShoppingBagIcon,
        title: "การขาย",
    },
    {
        href: "/app/transaction",
        icon: MessageSquareIcon,
        title: "บันทึกการขาย",
    },
    {
        href: "/app/product",
        icon: PackageIcon,
        title: "สินค้า",
    }
];

export default main;
