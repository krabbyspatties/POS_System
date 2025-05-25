import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Users } from "../../../interfaces/Users";
import UserService from "../../../services/UserService";
import ErrorHandler from "../../handler/ErrorHandler";

interface DeleteUserFormProps {
  user: Users | null;
  setSubmitForm: React.MutableRefObject<(() => void) | null>;
  setLoadingDestroy: (loading: boolean) => void;
  onDeletedUser: (message: string) => void;
}

const DeleteUserForm = ({
  user,
  setSubmitForm,
  setLoadingDestroy,
  onDeletedUser,
}: DeleteUserFormProps) => {
  const [state, setState] = useState({
    user_id: 0,
    full_name: "",
  });

  const handleDestroyUser = (e: FormEvent) => {
    e.preventDefault();

    setLoadingDestroy(true);

    UserService.destroyUser(state.user_id)
      .then((res) => {
        if (res.status === 200) {
          onDeletedUser(res.data.message);
        } else {
          console.error(
            "Unexpected status error while destroying user: ",
            res.status
          );
        }
      })
      .catch((error) => {
        ErrorHandler(error, null);
      })
      .finally(() => {
        setLoadingDestroy(false);
      });
  };

  const handleUserFullName = (firstName: string, lastName: string) => {
    return `${firstName} ${lastName}`;
  };

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (user) {
      setState((prevState) => ({
        ...prevState,
        user_id: user.user_id,
        full_name: handleUserFullName(user.first_name, user.last_name),
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        user_id: 0,
        full_name: "",
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
      <form ref={formRef} onSubmit={handleDestroyUser}>
        <div className="row">
          <div className="d-flex justify-content-center">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="full_name">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={state.full_name}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default DeleteUserForm;
