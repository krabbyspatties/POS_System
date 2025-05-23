import ReactDom from "react-dom/client";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import App from "./App.tsx";
import React from "react";

ReactDom.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
