import { useEffect, useState, useRef, type ChangeEvent, type FormEvent } from "react";
import type { UserFieldErrors } from "../../../interfaces/UserFieldErrors";
import type { Users } from "../../../interfaces/Users";

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
    const [state, setState] = useState({
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

    const handleStoreUser = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingUpdate(true);
        setState((prev) => ({ ...prev, errors: {} }));
        try {
            const response = await fetch(`/api/users/${state.user_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    first_name: state.first_name,
                    last_name: state.last_name,
                    user_name: state.user_name,
                    user_email: state.user_email,
                    user_phone: state.user_phone,
                    user_address: state.user_address,
                    user_image: state.user_image,
                    role: state.role,
                }),
            });

            if (!response.ok) {
                if (response.status === 422) {
                    const data = await response.json();
                    setState((prev) => ({
                        ...prev,
                        errors: data.errors || {},
                    }));
                } else {
                    alert("Failed to update user.");
                }
                setLoadingUpdate(false);
                return;
            }

            onUserUpdated("User updated successfully!");
        } catch (error) {
            alert("An error occurred while updating the user.");
        } finally {
            setLoadingUpdate(false);
        }
    };

    useEffect(() => {
        if (user) {
            setState((prevState) => ({
                ...prevState,
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                user_name: user.user_name,
                user_email: user.user_email,
                user_phone: user.user_phone,
                user_address: user.user_address,
                user_image: user.user_image,
                role: user.role,
            }));
        } else {
            setState((prevState) => ({
                ...prevState,
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
    </>
  )
}

export default EditUserForm

