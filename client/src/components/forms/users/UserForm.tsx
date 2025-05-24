import {
  useEffect,
  useRef,
  useState,
} from "react";
import type { ChangeEvent, FormEvent } from "react";
import ErrorHandler from "../../handler/ErrorHandler";
import type { UserFieldErrors } from "../../../interfaces/UserFieldErrors";
import UserService from "../../../services/UserService";

interface AddUserFormProps {
  setSubmitForm: (submitFn: () => void) => void;
  setLoadingStore: (loading: boolean) => void;
  onUserAdded: (message: string) => void;
}

const UserForm = ({
  setSubmitForm,
  setLoadingStore,
  onUserAdded,
}: AddUserFormProps) => {
  const [state, setState] = useState({
    first_name: "",
    last_name: "",
    user_name: "",
    user_email: "",
    password: "",
    password_confirmation: "",
    user_phone: "",
    user_address: "",
    user_image: "",
    role: "",
    errors: {} as UserFieldErrors,
  });

  const handleResetNecessaryFields = () => {
    setState((prevState) => ({
      ...prevState,
      first_name: "",
      last_name: "",
      user_name: "",
      user_email: "",
      password: "",
      password_confirmation: "",
      user_phone: "",
      user_address: "",
      user_image: "",
      role: "",
      errors: {} as UserFieldErrors,
    }));
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStoreUser = (e: FormEvent) => {
    e.preventDefault();

    setLoadingStore(true);

    UserService.storeUser(state)
      .then((res) => {
        if (res.status === 200) {
          handleResetNecessaryFields();
          onUserAdded(res.data.message);
        } else {
          console.error(
            "Unexpected status error while storing user: ",
            res.status
          );
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
          }));
        } else {
          ErrorHandler(error, null);
        }
      })
      .finally(() => {
        setLoadingStore(false);
      });
  };

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (setSubmitForm) {
      setSubmitForm(() => {
        if (formRef.current) {
          formRef.current.requestSubmit();
        }
      });
    }
  }, [setSubmitForm]);

  return (
    <form ref={formRef} onSubmit={handleStoreUser}>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              className={`form-control ${state.errors.first_name ? "is-invalid" : ""}`}
              name="first_name"
              id="first_name"
              value={state.first_name}
              onChange={handleInputChange}
              maxLength={55}
            />
            {state.errors.first_name && (
              <span className="text-danger">{state.errors.first_name[0]}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              className={`form-control ${state.errors.last_name ? "is-invalid" : ""}`}
              name="last_name"
              id="last_name"
              value={state.last_name}
              onChange={handleInputChange}
              maxLength={55}
            />
            {state.errors.last_name && (
              <span className="text-danger">{state.errors.last_name[0]}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="user_name">User Name</label>
            <input
              type="text"
              className={`form-control ${state.errors.user_name ? "is-invalid" : ""}`}
              name="user_name"
              id="user_name"
              value={state.user_name}
              onChange={handleInputChange}
              maxLength={55}
            />
            {state.errors.user_name && (
              <span className="text-danger">{state.errors.user_name[0]}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="user_email">Email</label>
            <input
              type="email"
              className={`form-control ${state.errors.user_email ? "is-invalid" : ""}`}
              name="user_email"
              id="user_email"
              value={state.user_email}
              onChange={handleInputChange}
              maxLength={255}
            />
            {state.errors.user_email && (
              <span className="text-danger">{state.errors.user_email[0]}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className={`form-control ${state.errors.password ? "is-invalid" : ""}`}
              name="password"
              id="password"
              value={state.password}
              onChange={handleInputChange}
              maxLength={255}
            />
            {state.errors.password && (
              <span className="text-danger">{state.errors.password[0]}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password_confirmation">Confirm Password</label>
            <input
              type="password"
              className={`form-control ${state.errors.password_confirmation ? "is-invalid" : ""}`}
              name="password_confirmation"
              id="password_confirmation"
              value={state.password_confirmation}
              onChange={handleInputChange}
              maxLength={255}
            />
            {state.errors.password_confirmation && (
              <span className="text-danger">{state.errors.password_confirmation[0]}</span>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="user_phone">Phone</label>
            <input
              type="text"
              className={`form-control ${state.errors.user_phone ? "is-invalid" : ""}`}
              name="user_phone"
              id="user_phone"
              value={state.user_phone}
              onChange={handleInputChange}
              maxLength={20}
            />
            {state.errors.user_phone && (
              <span className="text-danger">{state.errors.user_phone[0]}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="user_address">Address</label>
            <input
              type="text"
              className={`form-control ${state.errors.user_address ? "is-invalid" : ""}`}
              name="user_address"
              id="user_address"
              value={state.user_address}
              onChange={handleInputChange}
              maxLength={255}
            />
            {state.errors.user_address && (
              <span className="text-danger">{state.errors.user_address[0]}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="user_image">Image URL</label>
            <input
              type="text"
              className={`form-control ${state.errors.user_image ? "is-invalid" : ""}`}
              name="user_image"
              id="user_image"
              value={state.user_image}
              onChange={handleInputChange}
              maxLength={255}
            />
            {state.errors.user_image && (
              <span className="text-danger">{state.errors.user_image[0]}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="role">Role</label>
            <select
              className={`form-select ${state.errors.role ? "is-invalid" : ""}`}
              name="role"
              id="role"
              value={state.role}
              onChange={handleInputChange}
            >
              <option value="">Select Role</option>
              <option value="cashier">Cashier</option>
              <option value="manager">Manager</option>
              <option value="administrator">Administrator</option>
            </select>
            {state.errors.role && (
              <span className="text-danger">{state.errors.role[0]}</span>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default UserForm;
