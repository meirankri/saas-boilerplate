import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "Pricing",
    path: "/#pricing",
    newTab: false,
  },
  {
    id: 3,
    title: "Dashboard",
    path: "/dashboard",
    newTab: false,
    userOnly: true,
  },
];
export default menuData;
