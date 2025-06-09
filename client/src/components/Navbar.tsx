import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { FormEvent } from "react";
import { useState } from "react";
import ErrorHandler from "./handler/ErrorHandler";
import SpinnerSmall from "./SpinnerSmall";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [loadingLogout, setLoadingLogout] = useState(false);

  const getUserRole = (): string | null => {
    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    return parsedUser?.role || null;
  };

  const userRole = getUserRole() || "";

  const menuItems = [
    { route: "/users", title: "Users", allowedRoles: ["administrator"] },
    { route: "/items", title: "Items", allowedRoles: ["administrator", "manager"] },
    { route: "/products", title: "Products", allowedRoles: ["administrator", "manager", "cashier"] },
    { route: "/charts", title: "Charts", allowedRoles: ["administrator", "manager"] },
    { route: "/reports", title: "Reports", allowedRoles: ["administrator", "manager"] },
    { route: "/feedback", title: "Feedback", allowedRoles: ["administrator", "manager"] },
  ];

  const accessibleMenuItems = menuItems.filter((item) =>
    item.allowedRoles.includes(userRole)
  );

  const handleLogout = (e: FormEvent) => {
    e.preventDefault();
    setLoadingLogout(true);
    logout()
      .then(() => navigate("/"))
      .catch((error) => ErrorHandler(error, null))
      .finally(() => setLoadingLogout(false));
  };

  const handleUserFullName = () => {
    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    let fullName = "";
    if (parsedUser?.middle_name) {
      fullName = `${parsedUser.last_name}, ${parsedUser.first_name} ${parsedUser.middle_name[0]}.`;
    } else if (parsedUser) {
      fullName = `${parsedUser.last_name}, ${parsedUser.first_name}`;
    }
    return fullName;
  };

  return (
    <nav
      className="d-flex align-items-center justify-content-between mb-3"
      style={{
        width: "100%",
        height: "100px",
        position: "fixed",
        top: 0,
        left: 0,
        borderBottom: "1px solid #333",
        zIndex: 1000,
        backgroundColor: "#1a1a1a",
        color: "#fff",
        padding: "0 48px",
      }}
    >
      <ul className="nav mb-0 d-flex align-items-center">
        <div className="d-flex align-items-center me-5">
          <img
            src="src/assets/images/techfour.jpg"
            alt="Logo"
            style={{ width: "48px", height: "48px", marginRight: "12px" }}
          />
          <span
            className="navbar-brand mb-0"
            style={{ color: "#fff", fontWeight: "bold", letterSpacing: "1px", fontSize: "1.8rem" }}
          >
            POS_SYSTEM
          </span>
        </div>

        {accessibleMenuItems.map((menuItem, index) => (
          <li className="nav-item" key={index}>
            <Link
              className="nav-link"
              to={menuItem.route}
              style={{
                color: "#fff",
                backgroundColor: "#2c2c2c",
                borderRadius: "6px",
                marginLeft: "10px",
                padding: "10px 24px",
                fontWeight: 500,
                fontSize: "1rem",
              }}
            >
              {menuItem.title}
            </Link>
          </li>
        ))}
      </ul>

      <div className="d-flex align-items-center">
        <strong className="me-4" style={{ fontSize: "1rem" }}>{handleUserFullName()}</strong>
        <button
          type="button"
          className="btn btn-outline-light btn-md"
          onClick={handleLogout}
          disabled={loadingLogout}
        >
          {loadingLogout ? (
            <>
              <SpinnerSmall /> Logging Out...
            </>
          ) : (
            "Logout"
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
