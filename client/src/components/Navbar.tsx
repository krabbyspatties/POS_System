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
    {
      route: "/items",
      title: "Items",
      allowedRoles: ["administrator", "manager"],
    },
    {
      route: "/products",
      title: "Products",
      allowedRoles: ["administrator", "manager", "cashier"],
    },
    {
      route: "/charts",
      title: "Charts",
      allowedRoles: ["administrator", "manager"],
    },
    {
      route: "/reports",
      title: "Reports",
      allowedRoles: ["administrator", "manager"],
    },
    {
      route: "/feedback",
      title: "Feedback",
      allowedRoles: ["administrator", "manager"],
    },
  ];

  const accessibleMenuItems = menuItems.filter((item) =>
    item.allowedRoles.includes(userRole)
  );

  const handleLogout = (e: FormEvent) => {
    e.preventDefault();
    setLoadingLogout(true);
    logout()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        ErrorHandler(error, null);
      })
      .finally(() => {
        setLoadingLogout(false);
      });
  };

  const handleUserInfo = () => {
    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;

    if (!parsedUser) {
      return { fullName: "", userImage: "" };
    }

    const { first_name, middle_name, last_name, user_image } = parsedUser;

    const fullName = middle_name
      ? `${last_name}, ${first_name} ${middle_name[0]}.`
      : `${last_name}, ${first_name}`;

    return { fullName, userImage: user_image };
  };

  const { fullName, userImage } = handleUserInfo();

  return (
    <nav
      className="d-flex align-items-center justify-content-between shadow-lg"
      style={{
        width: "100%",
        height: "80px",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        background: "linear-gradient(to right, #000000, #8B0000)",
        color: "#fff",
        padding: "0 32px",
        borderBottom: "2px solid rgba(255,255,255,0.1)",
      }}
    >
      <ul className="nav mb-0 d-flex align-items-center">
        <Link
          to="#"
          className="me-4 d-flex align-items-center text-decoration-none"
        >
          <img
            src="/src/images/logo.png"
            alt="Logo"
            style={{
              height: "45px",
              width: "auto",
              objectFit: "contain",
              borderRadius: "8px",
              backgroundColor: "#fff",
              padding: "4px",
              boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            }}
          />
        </Link>

        {accessibleMenuItems.map((menuItem, index) => (
          <li className="nav-item" key={index}>
            <Link
              className="nav-link"
              to={menuItem.route}
              style={{
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: "30px",
                marginLeft: "8px",
                padding: "8px 20px",
                fontWeight: 500,
                transition: "all 0.2s ease-in-out",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
            >
              {menuItem.title}
            </Link>
          </li>
        ))}
      </ul>

      <div className="d-flex align-items-center">
        {userImage && (
          <img
            src={
              userImage
                ? `/storage/${userImage}`
                : "/src/images/placeholder.jpg"
            }
            alt="User"
            style={{
              height: "40px",
              width: "40px",
              objectFit: "cover",
              borderRadius: "50%",
              marginRight: "10px",
              border: "2px solid #fff",
            }}
          />
        )}
        <strong className="me-3">{fullName}</strong>
        <button
          type="button"
          className="btn btn-outline-light btn-sm"
          onClick={handleLogout}
          disabled={loadingLogout}
          style={{
            borderColor: "#fff",
          }}
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
