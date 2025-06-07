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

// const submitFormRef = React.createRef<() => void>();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute>
        <UsersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/itemCategories",
    element: (
      <ProtectedRoute>
        <CategoriesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/itemCategories/edit/:category_id",
    element: (
      <ProtectedRoute>
        <EditItemCategory />
      </ProtectedRoute>
    ),
  },
  {
    path: "/itemCategories/delete/:category_id",
    element: (
      <ProtectedRoute>
        <DeleteCategory />
      </ProtectedRoute>
    ),
  },
  {
    path: "/items",
    element: (
      <ProtectedRoute>
        <ItemsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/products",
    element: (
      <ProtectedRoute>
        <ProductPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/receipt",
    element: (
      <ProtectedRoute>
        <ReceiptPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/charts",
    element: (
      <ProtectedRoute>
        <ChartPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reports",
    element: (
      <ProtectedRoute>
        <ReportPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feedback",
    element: (
      <ProtectedRoute>
        <FeedbackPage />
      </ProtectedRoute>
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
