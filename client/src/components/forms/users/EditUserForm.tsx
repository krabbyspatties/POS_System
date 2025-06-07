import {
  useEffect,
  useState,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { UserFieldErrors } from "../../../interfaces/User/UserFieldErrors";
import type { Users } from "../../../interfaces/User/Users";
import UserService from "../../../services/UserService";

interface EditUserFormProps {
  user: Users | null;
  setSubmitForm: React.MutableRefObject<(() => void) | null>;
  setLoadingUpdate: (loading: boolean) => void;
  onUserUpdated: (message: string) => void;
}

const EditUserForm = ({
  user,
  setSubmitForm,
  setLoadingUpdate,
  onUserUpdated,
}: EditUserFormProps) => {
  const [state, setState] = useState<{
    user_id: number;
    first_name: string;
    last_name: string;
    user_name: string;
    user_email: string;
    user_phone: string;
    user_address: string;
    user_image: string | File;
    role: string;
    errors: UserFieldErrors;
  }>({
    user_id: 0,
    first_name: "",
    last_name: "",
    user_name: "",
    user_email: "",
    user_phone: "",
    user_address: "",
    user_image: "",
    role: "",
    errors: {} as UserFieldErrors,
  });

  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingUpdate(true);
    setState((prev) => ({ ...prev, errors: {} }));

    try {
      const formData = new FormData();

      // Append all required fields
      formData.append("first_name", state.first_name);
      formData.append("last_name", state.last_name);
      formData.append("user_name", state.user_name);
      formData.append("user_email", state.user_email);
      formData.append("user_phone", state.user_phone || "");
      formData.append("user_address", state.user_address || "");
      formData.append("role", state.role);

      // Handle image properly
      if (state.user_image instanceof File) {
        formData.append("user_image", state.user_image);
      } else if (
        typeof state.user_image === "string" &&
        state.user_image !== ""
      ) {
        formData.append("existing_image", state.user_image);
      }

      console.log("Submitting form data for user:", state.user_id);

      const response = await UserService.updateUser(state.user_id, formData);

      // Check for successful response
      if (response.status === 200) {
        onUserUpdated(response.data.message || "User updated successfully!");
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error: any) {
      console.error("Update user error:", error);

      if (error.response?.status === 422) {
        // Handle validation errors
        setState((prev) => ({
          ...prev,
          errors: error.response.data.errors || {},
        }));
      } else if (error.response?.status === 404) {
        alert("User not found. Please refresh the page and try again.");
      } else if (error.response?.status === 403) {
        alert("You don't have permission to update this user.");
      } else {
        alert(
          "An error occurred while updating the user: " +
            (error.response?.data?.message || error.message)
        );
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  useEffect(() => {
    if (user) {
      setState((prevState) => ({
        ...prevState,
        user_id: user.user_id,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        user_name: user.user_name || "",
        user_email: user.user_email || "",
        user_phone: user.user_phone || "",
        user_address: user.user_address || "",
        user_image: user.user_image || "",
        role: user.role || "",
        errors: {} as UserFieldErrors,
      }));
    }

    setSubmitForm.current = () => {
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    };
  }, [user, setSubmitForm]);

  return (
    <>
      <form ref={formRef} onSubmit={handleUpdateUser}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="first_name">First Name</label>
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
                required
              />
              {state.errors.first_name && (
                <span className="text-danger">
                  {state.errors.first_name[0]}
                </span>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="last_name">Last Name</label>
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
                required
              />
              {state.errors.last_name && (
                <span className="text-danger">{state.errors.last_name[0]}</span>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="user_name">User Name</label>
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
                required
              />
              {state.errors.user_name && (
                <span className="text-danger">{state.errors.user_name[0]}</span>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="user_email">Email</label>
              <input
                type="email"
                className={`form-control ${
                  state.errors.user_email ? "is-invalid" : ""
                }`}
                name="user_email"
                id="user_email"
                value={state.user_email}
                onChange={handleInputChange}
                maxLength={255}
                required
              />
              {state.errors.user_email && (
                <span className="text-danger">
                  {state.errors.user_email[0]}
                </span>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="user_phone">Phone</label>
              <input
                type="text"
                className={`form-control ${
                  state.errors.user_phone ? "is-invalid" : ""
                }`}
                name="user_phone"
                id="user_phone"
                value={state.user_phone}
                onChange={handleInputChange}
                maxLength={20}
              />
              {state.errors.user_phone && (
                <span className="text-danger">
                  {state.errors.user_phone[0]}
                </span>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="user_address">Address</label>
              <input
                type="text"
                className={`form-control ${
                  state.errors.user_address ? "is-invalid" : ""
                }`}
                name="user_address"
                id="user_address"
                value={state.user_address}
                onChange={handleInputChange}
                maxLength={255}
              />
              {state.errors.user_address && (
                <span className="text-danger">
                  {state.errors.user_address[0]}
                </span>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="user_image">Profile Image</label>
              <input
                type="file"
                className={`form-control ${
                  state.errors.user_image ? "is-invalid" : ""
                }`}
                name="user_image"
                id="user_image"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setState((prevState) => ({
                      ...prevState,
                      user_image: file,
                    }));
                  }
                }}
              />
              {state.errors.user_image && (
                <span className="text-danger">
                  {state.errors.user_image[0]}
                </span>
              )}
              {typeof state.user_image === "string" && state.user_image && (
                <div className="mt-2">
                  <small className="text-muted">
                    Current image: {state.user_image}
                  </small>
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="role">Role</label>
              <select
                className={`form-select ${
                  state.errors.role ? "is-invalid" : ""
                }`}
                name="role"
                id="role"
                value={state.role}
                onChange={handleInputChange}
                required
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
    </>
  );
};

export default EditUserForm;
