import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import ErrorHandler from "../../handler/ErrorHandler";
import type { UserFieldErrors } from "../../../interfaces/User/UserFieldErrors";
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
    user_image: "" as string | File,
    role: "",
    errors: {} as UserFieldErrors,
  });

  // Reset form fields and errors
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

  // Handle input change for text/select fields
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setState((prevState) => ({
      ...prevState,
      user_image: file ?? "",
    }));
  };

  // Submit form data
  const handleStoreUser = (e: FormEvent) => {
    e.preventDefault();

    setLoadingStore(true);

    const formData = new FormData();
    formData.append("first_name", state.first_name);
    formData.append("last_name", state.last_name);
    formData.append("user_name", state.user_name);
    formData.append("user_email", state.user_email);
    formData.append("password", state.password);
    formData.append("password_confirmation", state.password_confirmation);
    formData.append("user_phone", state.user_phone);
    formData.append("user_address", state.user_address);
    formData.append("role", state.role);

    if (state.user_image instanceof File) {
      formData.append("user_image", state.user_image);
    }

    UserService.storeUser(formData)
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
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "60vh" }}
    >
      <form
        ref={formRef}
        onSubmit={handleStoreUser}
        style={{ width: "100%", maxWidth: 900 }}
        encType="multipart/form-data"
      >
        <div className="row">
          <div className="col-md-6">
            {/* First Name */}
            <div className="mb-3">
              <label htmlFor="first_name" className="form-label">
                First Name
              </label>
              <input
                type="text"
                className={`form-control ${
                  state.errors.first_name ? "is-invalid" : ""
                }`}
                name="first_name"
                id="first_name"
                value={state.first_name}
                onChange={handleInputChange}
                maxLength={55}
              />
              {state.errors.first_name && (
                <div className="invalid-feedback">
                  {state.errors.first_name[0]}
                </div>
              )}
            </div>

            {/* Last Name */}
            <div className="mb-3">
              <label htmlFor="last_name" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                className={`form-control ${
                  state.errors.last_name ? "is-invalid" : ""
                }`}
                name="last_name"
                id="last_name"
                value={state.last_name}
                onChange={handleInputChange}
                maxLength={55}
              />
              {state.errors.last_name && (
                <div className="invalid-feedback">
                  {state.errors.last_name[0]}
                </div>
              )}
            </div>

            {/* Username */}
            <div className="mb-3">
              <label htmlFor="user_name" className="form-label">
                Username
              </label>
              <input
                type="text"
                className={`form-control ${
                  state.errors.user_name ? "is-invalid" : ""
                }`}
                name="user_name"
                id="user_name"
                value={state.user_name}
                onChange={handleInputChange}
                maxLength={55}
              />
              {state.errors.user_name && (
                <div className="invalid-feedback">
                  {state.errors.user_name[0]}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="user_email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className={`form-control ${
                  state.errors.user_email ? "is-invalid" : ""
                }`}
                name="user_email"
                id="user_email"
                value={state.user_email}
                onChange={handleInputChange}
              />
              {state.errors.user_email && (
                <div className="invalid-feedback">
                  {state.errors.user_email[0]}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
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
                <div className="invalid-feedback">
                  {state.errors.password[0]}
                </div>
              )}
            </div>

            {/* Password Confirmation */}
            <div className="mb-3">
              <label htmlFor="password_confirmation" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className={`form-control ${
                  state.errors.password_confirmation ? "is-invalid" : ""
                }`}
                name="password_confirmation"
                id="password_confirmation"
                value={state.password_confirmation}
                onChange={handleInputChange}
              />
              {state.errors.password_confirmation && (
                <div className="invalid-feedback">
                  {state.errors.password_confirmation[0]}
                </div>
              )}
            </div>
          </div>

          <div className="col-md-6">
            {/* Phone */}
            <div className="mb-3">
              <label htmlFor="user_phone" className="form-label">
                Phone
              </label>
              <input
                type="text"
                className={`form-control ${
                  state.errors.user_phone ? "is-invalid" : ""
                }`}
                name="user_phone"
                id="user_phone"
                value={state.user_phone}
                onChange={handleInputChange}
                maxLength={15}
              />
              {state.errors.user_phone && (
                <div className="invalid-feedback">
                  {state.errors.user_phone[0]}
                </div>
              )}
            </div>

            {/* Address */}
            <div className="mb-3">
              <label htmlFor="user_address" className="form-label">
                Address
              </label>
              <input
                type="text"
                className={`form-control ${
                  state.errors.user_address ? "is-invalid" : ""
                }`}
                name="user_address"
                id="user_address"
                value={state.user_address}
                onChange={handleInputChange}
                maxLength={100}
              />
              {state.errors.user_address && (
                <div className="invalid-feedback">
                  {state.errors.user_address[0]}
                </div>
              )}
            </div>

            {/* User Image */}
            <div className="mb-3">
              <label htmlFor="user_image" className="form-label">
                Image File
              </label>
              <input
                type="file"
                className={`form-control ${
                  state.errors.user_image ? "is-invalid" : ""
                }`}
                name="user_image"
                id="user_image"
                accept="image/*"
                onChange={handleFileChange}
              />
              {state.errors.user_image && (
                <div className="invalid-feedback">
                  {state.errors.user_image[0]}
                </div>
              )}
            </div>

            {/* Role */}
            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                Role
              </label>
              <select
                className={`form-select ${
                  state.errors.role ? "is-invalid" : ""
                }`}
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
                <div className="invalid-feedback">{state.errors.role[0]}</div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
