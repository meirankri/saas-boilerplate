import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "pricing",
    path: "/#pricing",
    newTab: false,
  },
  {
    id: 3,
    title: "dashboard",
    path: "/dashboard",
    newTab: false,
    userOnly: true,
  },
];
export default menuData;
