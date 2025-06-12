import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./components/pages/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import UsersPage from "./components/pages/users/Users";
import CategoriesPage from "./components/pages/itemCategory/ItemCategory";
import EditItemCategory from "./components/pages/itemCategory/EditItemCategory";
import DeleteCategory from "./components/pages/itemCategory/DeleteItemCategory";
import ItemsPage from "./components/pages/items/Items";
import ProductPage from "./components/pages/product/productPage";
import ReceiptPage from "./components/pages/receipt/ReceiptPage";
import ChartPage from "./components/pages/chart/Chart";
import ReportPage from "./components/pages/report/report";
import FeedbackPage from "./components/pages/feedback/feedback";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute allowedRoles={["administrator"]}>
        <UsersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/itemCategories",
    element: (
      <ProtectedRoute allowedRoles={["manager", "administrator"]}>
        <CategoriesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/itemCategories/edit/:category_id",
    element: (
      <ProtectedRoute allowedRoles={["manager", "administrator"]}>
        <EditItemCategory />
      </ProtectedRoute>
    ),
  },
  {
    path: "/itemCategories/delete/:category_id",
    element: (
      <ProtectedRoute allowedRoles={["manager", "administrator"]}>
        <DeleteCategory />
      </ProtectedRoute>
    ),
  },
  {
    path: "/items",
    element: (
      <ProtectedRoute allowedRoles={["manager", "administrator"]}>
        <ItemsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/products",
    element: (
      <ProtectedRoute allowedRoles={["cashier", "manager", "administrator"]}>
        <ProductPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/receipt",
    element: (
      <ProtectedRoute allowedRoles={["cashier", "manager", "administrator"]}>
        <ReceiptPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/charts",
    element: (
      <ProtectedRoute allowedRoles={["manager", "administrator"]}>
        <ChartPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reports",
    element: (
      <ProtectedRoute allowedRoles={["manager", "administrator"]}>
        <ReportPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feedback",
    element: (
      <ProtectedRoute allowedRoles={["manager", "administrator"]}>
        <FeedbackPage />
      </ProtectedRoute>
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
