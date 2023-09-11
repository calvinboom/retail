// assets
import { PieChart as PieChartIcon, MessageSquare as MessageSquareIcon, ShoppingBag as ShoppingBagIcon, Package as PackageIcon, UserPlus as UserPlusIcon } from "react-feather";

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const main = [
    {
        href: "/app/main",
        icon: PieChartIcon,
        title: "หน้าหลัก",
        role: [ "user", "admin" ]
    },
    {
        href: "/app/shop",
        icon: ShoppingBagIcon,
        title: "การขาย",
        role: [ "user", "admin" ]
    },
    {
        href: "/app/transaction",
        icon: MessageSquareIcon,
        title: "บันทึกการขาย",
        role: [ "user", "admin" ]
    },
    {
        href: "/app/product",
        icon: PackageIcon,
        title: "สินค้า",
        role: [ "user", "admin" ]
    },
    {
        href: "/app/manage-user",
        icon: UserPlusIcon,
        title: "จัดการผู้ใช้งาน",
        role: [ "admin" ]
    }
];

export default main;
