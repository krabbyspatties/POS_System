import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useState, type ChangeEvent, type FormEvent } from "react";
import SpinnerSmall from "../../SpinnerSmall";
import AlertMessage from "../../AlertMessage";
import ErrorHandler from "../../handler/ErrorHandler";
import type { LoginFieldErrors } from "../../../interfaces/LoginFieldErrors";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [state, setState] = useState({
    loadingLogin: false,
    user_email: "",
    password: "",
    errors: {} as LoginFieldErrors,
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setState((prevState) => ({
      ...prevState,
      loadingLogin: true,
      errors: {} as LoginFieldErrors,
    }));

    login(state.user_email, state.password)
      .then(() => navigate("/products"))
      .catch((error) => {
        console.log("Login error:", error); // Debug log

        if (error.response) {
          const status = error.response.status;
          const data = error.response.data;

          if (status === 422) {
            // Validation errors
            setState((prevState) => ({
              ...prevState,
              errors: data.errors || {},
            }));
          } else if (status === 401) {
            // Authentication failed
            handleShowAlertMessage(
              data.message || "Invalid credentials, please try again.",
              false,
              true
            );
          } else if (status === 429) {
            // Too many attempts
            handleShowAlertMessage(
              data.message ||
                "Too many login attempts. Please try again later.",
              false,
              true
            );
          } else {
            // Other server errors
            handleShowAlertMessage(
              data.message ||
                "An error occurred during login. Please try again.",
              false,
              true
            );
          }
        } else if (error.request) {
          // Network error
          handleShowAlertMessage(
            "Network error. Please check your connection and try again.",
            false,
            true
          );
        } else {
          // Other errors
          handleShowAlertMessage(
            "An unexpected error occurred. Please try again.",
            false,
            true
          );
        }
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingLogin: false,
        }));
      });
  };

  const handleShowAlertMessage = (
    message: string,
    isSuccess: boolean,
    isVisible: boolean
  ) => {
    setMessage(message);
    setIsSuccess(isSuccess);
    setIsVisible(isVisible);
  };

  const handleCloseAlertMessage = () => {
    setMessage("");
    setIsSuccess(false);
    setIsVisible(false);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: `url("/src/images/bg.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    >
      <div
        className="p-1 rounded-4 shadow-lg"
        style={{
          background: "linear-gradient(to right, black, red)",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <div
          className="card rounded-4 p-4 p-md-5"
          style={{
            backgroundColor: "rgba(255,255,255,0.95)",
          }}
        >
          <div className="text-center mb-4">
            <h2 className="fw-bold">Welcome</h2>
            <p className="text-muted small">Login to your account</p>
          </div>

          <AlertMessage
            message={message}
            isSuccess={isSuccess}
            isVisible={isVisible}
            onClose={handleCloseAlertMessage}
          />

          <form onSubmit={handleLogin} noValidate>
            <div className="mb-3">
              <label htmlFor="user_email" className="form-label fw-semibold">
                Email
              </label>
              <div
                style={{
                  padding: "1px",
                  borderRadius: "10px",
                  background: "linear-gradient(to right, black, red)",
                }}
              >
                <input
                  type="text"
                  className={`form-control shadow-none ${
                    state.errors.user_email ? "is-invalid" : ""
                  }`}
                  style={{
                    borderRadius: "10px",
                    padding: "12px",
                    border: "none",
                  }}
                  name="user_email"
                  id="user_email"
                  value={state.user_email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </div>
              {state.errors.user_email && (
                <div className="invalid-feedback">
                  {state.errors.user_email[0]}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">
                Password
              </label>
              <div
                className="position-relative"
                style={{
                  padding: "1px",
                  borderRadius: "10px",
                  background: "linear-gradient(to right, black, red)",
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control shadow-none ${
                    state.errors.password ? "is-invalid" : ""
                  }`}
                  style={{
                    borderRadius: "10px",
                    padding: "12px",
                    border: "none",
                  }}
                  name="password"
                  id="password"
                  value={state.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2"
                  style={{ background: "transparent", border: "none" }}
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-dark" />
                  ) : (
                    <Eye size={18} className="text-dark" />
                  )}
                </button>
              </div>
              {state.errors.password && (
                <div className="invalid-feedback">
                  {state.errors.password[0]}
                </div>
              )}
            </div>

            <div className="d-grid mt-4">
              <button
                type="submit"
                className="btn btn-dark btn-lg rounded-pill"
                disabled={state.loadingLogin}
                style={{
                  background: "linear-gradient(to right, black, red)",
                  border: "none",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                {state.loadingLogin ? (
                  <>
                    <SpinnerSmall /> <span className="ms-2">Logging In...</span>
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
