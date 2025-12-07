import React, { createContext, useState, useContext, useEffect } from "react";
import {
  login as loginApi,
  signup as signupApi,
  guestLogin as guestLoginApi,
} from "../services/api";

type Role = "Viewer" | "Editor";

interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: Role;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  guestLogin: () => Promise<void>;
  logout: () => void;
  setRole: (role: Role) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [role, setRole] = useState<Role>("Editor");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setRole(parsedUser.role);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginApi(email, password);
    setToken(data.token);
    setUser(data.user);
    setRole(data.user.role);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const signup = async (username: string, email: string, password: string) => {
    const data = await signupApi(username, email, password);
    setToken(data.token);
    setUser(data.user);
    setRole(data.user.role);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const guestLogin = async () => {
    const data = await guestLoginApi();
    setToken(data.token);
    setUser(data.user);
    setRole(data.user.role);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRole("Viewer");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        setRole,
        login,
        signup,
        guestLogin,
        logout,
        isAuthenticated: !!token,
      }}
    >
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
