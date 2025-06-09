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
        navigate("/products");
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
      <AlertMessage
        message={message}
        isSuccess={isSuccess}
        isVisible={isVisible}
        onClose={handleCloseAlertMessage}
      />
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="user_email">Email</label>
          <input
            type="text"
            className={`form-control ${
              state.errors.user_email ? "is-invalid" : ""
            }`}
            name="user_email"
            id="user_email"
            value={state.user_email}
            onChange={handleInputChange}
            autoFocus
          />
          {state.errors.user_email && (
            <span className="text-danger">{state.errors.user_email[0]}</span>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className={`form-control ${
              state.errors.password ? "is-invalid" : ""
            }`}
            name="password"
            id="password"
            value={state.password}
            onChange={handleInputChange}
          />
          {state.errors.password && (
            <span className="text-danger">{state.errors.password[0]}</span>
          )}
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={state.loadingLogin}
          >
            {state.loadingLogin ? (
              <>
                <SpinnerSmall /> Logging In...
              </>
            ) : (
              "Login"
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
