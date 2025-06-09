import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useState, type ChangeEvent, type FormEvent } from "react";
import SpinnerSmall from "../../SpinnerSmall";
import AlertMessage from "../../AlertMessage";
import ErrorHandler from "../../handler/ErrorHandler";
import type { LoginFieldErrors } from "../../../interfaces/LoginFieldErrors";

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
      errors: {} as LoginFieldErrors, // clear previous errors
    }));

    login(state.user_email, state.password)
      .then(() => {
        console.log("Login successful. navigating");
        navigate("/users");
      })
      .catch((error) => {
        console.error("Login failed", error);
        if (error.response.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
          }));
        } else if (error.response.status === 401) {
          handleShowAlertMessage(error.response.data.message, false, true);
        } else {
          ErrorHandler(error, null);
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
        className="card shadow-lg p-4 p-md-5 rounded-4"
        style={{
          maxWidth: "400px",
          width: "100%",
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
            <input
              type="text"
              className={`form-control shadow-sm ${
                state.errors.user_email ? "is-invalid" : ""
              }`}
              name="user_email"
              id="user_email"
              value={state.user_email}
              onChange={handleInputChange}
              autoFocus
              placeholder="Enter your email"
            />
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
            <input
              type="password"
              className={`form-control shadow-sm ${
                state.errors.password ? "is-invalid" : ""
              }`}
              name="password"
              id="password"
              value={state.password}
              onChange={handleInputChange}
              placeholder="••••••••"
            />
            {state.errors.password && (
              <div className="invalid-feedback">{state.errors.password[0]}</div>
            )}
          </div>

          <div className="d-grid mt-4">
            <button
              type="submit"
              className="btn btn-primary btn-lg rounded-3"
              disabled={state.loadingLogin}
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
  );
};

export default LoginForm;
