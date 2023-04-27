import DashboardLayout from "@/pages/Dashboard/Layout/DashboardLayout.vue";
import AuthLayout from "@/pages/Dashboard/Pages/AuthLayout.vue";

// Dashboard pages
import Dashboard from "@/pages/Dashboard/Dashboard.vue";
// Profile
import UserProfile from "@/pages/Dashboard/Examples/UserProfile.vue";

// User Management
import ListUserPage from "@/pages/Dashboard/Examples/UserManagement/ListUserPage.vue";

// Pages
import RtlSupport from "@/pages/Dashboard/Pages/RtlSupport.vue";
import Login from "@/pages/Dashboard/Pages/Login.vue";
import Register from "@/pages/Dashboard/Pages/Register.vue";

// Components pages
import Notifications from "@/pages/Dashboard/Components/Notifications.vue";
import Icons from "@/pages/Dashboard/Components/Icons.vue";
import Typography from "@/pages/Dashboard/Components/Typography.vue";

// TableList pages
import RegularTables from "@/pages/Dashboard/Tables/RegularTables.vue";

// Maps pages
import FullScreenMap from "@/pages/Dashboard/Maps/FullScreenMap.vue";

//import middleware
import auth from "@/middleware/auth";
import guest from "@/middleware/guest";
import ItemsList from "../pages/Dashboard/Tables/ItemsList.vue";
import ProductsList from "../pages/Dashboard/Tables/ProductsList.vue";
import AllItems from "../pages/Dashboard/Tables/AllItems.vue";
import AllProducts from "../pages/Dashboard/Tables/AllProducts.vue";
import Ads from "../pages/Dashboard/Tables/Ads.vue";

let componentsMenu = {
  path: "/components",
  component: DashboardLayout,
  redirect: "/components/notification",
  name: "Components",
  children: [
    {
      path: "table",
      name: "Categories",
      components: { default: RegularTables },
      meta: { middleware: auth },
    },
    {
      path: "category/:id?/items",
      name: "Items",
      components: { default: ItemsList },
      meta: { middleware: auth },
    },
    {
      path: "category/:id?/items/:item_id?",
      name: "Products",
      components: { default: ProductsList },
      meta: { middleware: auth },
    },
    {
      path: "all-items",
      name: "All Items",
      components: { default: AllItems },
      meta: { middleware: auth },
    },
    {
      path: "all-products",
      name: "All Products",
      components: { default: AllProducts },
      meta: { middleware: auth },
    },
    {
      path: "ads",
      name: "Ads",
      components: { default: Ads },
      meta: { middleware: auth },
    },
    {
      path: "typography",
      name: "Typography",
      components: { default: Typography },
      meta: { middleware: auth },
    },
    {
      path: "icons",
      name: "Icons",
      components: { default: Icons },
      meta: { middleware: auth },
    },
    {
      path: "maps",
      name: "Maps",
      meta: {
        hideContent: true,
        hideFooter: true,
        navbarAbsolute: true,
        middleware: auth,
      },
      components: { default: FullScreenMap },
    },
    {
      path: "notifications",
      name: "Notifications",
      components: { default: Notifications },
      meta: { middleware: auth },
    },
    {
      path: "rtl",
      name: "وحة القيادة",
      meta: {
        rtlActive: true,
        middleware: auth,
      },
      components: { default: RtlSupport },
    },
  ],
};

let examplesMenu = {
  path: "/examples",
  component: DashboardLayout,
  name: "Examples",
  children: [
    {
      path: "user-profile",
      name: "User Profile",
      components: { default: UserProfile },
      meta: { middleware: auth },
    },
    {
      path: "user-management/list-users",
      name: "List Users",
      components: { default: ListUserPage },
      meta: { middleware: auth },
    },
  ],
};

let authPages = {
  path: "/",
  component: AuthLayout,
  name: "Authentication",
  children: [
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: { middleware: guest },
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
      meta: { middleware: guest },
    },
  ],
};

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
    name: "Home",
  },
  {
    path: "/",
    component: DashboardLayout,
    meta: { middleware: auth },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        components: { default: Dashboard },
        meta: { middleware: auth },
      },
    ],
  },
  componentsMenu,
  examplesMenu,
  authPages,
];

export default routes;
