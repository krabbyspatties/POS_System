import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import AxiosInstance from "../AxiosInstance";

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  user_image: string | File;
  user_name: string;
  user_email: string;
  user_phone: string;
  user_address: string;
  role: "cashier" | "manager" | "administrator";
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (user_email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (token) {
      AxiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }
  }, [token]);

  const login = async (user_email: string, password: string) => {
    const response = await AxiosInstance.post("/login", {
      user_email,
      password,
    });

    const { token, user } = response.data;
    setToken(token);
    setUser(user);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    AxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const logout = async () => {
    try {
      await AxiosInstance.post("/logout");
    } catch (err) {
      console.warn("Logout error:", err);
    }

    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete AxiosInstance.defaults.headers.common["Authorization"];
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
