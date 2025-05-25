import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./components/pages/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import UsersPage from "./components/pages/users/Users";
import CategoriesPage from "./components/pages/itemCategory/ItemCategory";
import EditItemCategory from "./components/pages/itemCategory/EditItemCategory";
import DeleteCategory from "./components/pages/itemCategory/DeleteItemCategory";

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
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
