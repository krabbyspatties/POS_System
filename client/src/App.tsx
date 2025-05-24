import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import ProtectedRoute from "./components/ProtectedRoute";
// import Users from "../src/components/forms/users/UserForm";
import Login from "./components/pages/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Users from "./components/pages/users/Users";

// import React from "react";

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
        <Users />
      </ProtectedRoute>
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
