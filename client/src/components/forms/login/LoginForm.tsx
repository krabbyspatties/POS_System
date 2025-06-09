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
    email: "",
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
    }));

    login(state.email, state.password)
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
    <>
      <div className="container d-flex align-items-center justify-content-center min-vh-100">
  <div
    className="card flex-row shadow"
    style={{
      maxWidth: "800px",
      width: "100%",
      borderRadius: "1rem",
      overflow: "hidden",
    }}
  >
    {/* Logo section (left side) */}
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        width: "45%",
        backgroundColor: "#f8f9fa",
        padding: "2rem",
      }}
    >
      <img
        src="src/assets/images/techfour.jpg" 
        alt="POS Logo"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>

    {/* Login form section (right side) */}
    <div className="p-4 flex-grow-1">
      <h3 className="mb-4 text-center">POS LOGIN</h3>

      <AlertMessage
        message={message}
        isSuccess={isSuccess}
        isVisible={isVisible}
        onClose={handleCloseAlertMessage}
      />

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="text"
            className={`form-control ${state.errors.email ? "is-invalid" : ""}`}
            id="email"
            name="email"
            value={state.email}
            onChange={handleInputChange}
            autoFocus
          />
          {state.errors.email && (
            <div className="invalid-feedback">{state.errors.email[0]}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className={`form-control ${state.errors.password ? "is-invalid" : ""}`}
            id="password"
            name="password"
            value={state.password}
            onChange={handleInputChange}
          />
          {state.errors.password && (
            <div className="invalid-feedback">{state.errors.password[0]}</div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
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
      </form>
    </div>
  </div>
</div>



    </>
  );
};

export default LoginForm;
