// assets
import { PieChart as PieChartIcon, MessageSquare as MessageSquareIcon, ShoppingBag as ShoppingBagIcon, Package as PackageIcon, Edit as EditIcon , UserPlus as UserPlusIcon, Users as UsersIcon, User as UserIcon, Camera as CameraIcon } from "react-feather";

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
        role: [ "admin" ]
    },
    {
        href: "/app/product",
        icon: PackageIcon,
        title: "สินค้า",
        role: [ "admin" ]
    },
    {
        href: "/app/buy-product",
        icon: EditIcon,
        title: "สั่งซื้อสินค้า",
        role: [ "user", "admin" ]
    },
    {
        href: "/app/check-stock",
        icon: CameraIcon,
        title: "เช็คสต๊อกด้วยบาร์โค้ด",
        role: [ "user", "admin" ]
    },
    {
        href: "/app/manage-user",
        icon: UserPlusIcon,
        title: "จัดการผู้ใช้งาน",
        role: [ "admin" ]
    },
    {
        href: "/app/manage-seller",
        icon: UsersIcon,
        title: "จัดการตัวแทน",
        role: [ "admin" ]
    },
    {
        href: "/app/manage-customer",
        icon: UserIcon,
        title: "จัดการลูกค้า",
        role: [ "admin" ]
    }
];

export default main;
