import { useEffect, useState } from "react";
import UserService from "../../../services/UserService";
import ErrorHandler from "../../handler/ErrorHandler";
import Spinner from "../../Spinner";

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  user_image: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  user_address: string;
  role: string;
}

interface UsersTableProps {
  refreshUsers: boolean;
  // onEditUser: (user: User) => void;
  // onDeleteUser: (user: User) => void;
}

const UsersTable = ({
  refreshUsers,
  // onEditUser,
  // onDeleteUser,
}: UsersTableProps) => {
  const [state, setState] = useState({
    loadingUsers: true,
    users: [] as User[],
  });

  const handleLoadUsers = () => {
    UserService.loadUsers()
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            users: res.data.users,
          }));
        } else {
          console.error(
            "Unexpected status error while loading users: ",
            res.status
          );
        }
      })
      .catch((error) => {
        ErrorHandler(error, null);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingUsers: false,
        }));
      });
  };

  useEffect(() => {
    handleLoadUsers();
  }, [refreshUsers]);

  return (
    <>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>No.</th>
            <th>Image</th>
            <th>Full Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {state.loadingUsers ? (
            <tr className="align-middle">
              <td colSpan={9} className="text-center">
                <Spinner />
              </td>
            </tr>
          ) : state.users.length > 0 ? (
            state.users.map((user, index) => (
              <tr className="align-middle" key={user.user_id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={user.user_image}
                    alt={user.first_name}
                    style={{ width: 40, height: 40, borderRadius: "50%" }}
                  />
                </td>
                <td>{`${user.last_name}, ${user.first_name}`}</td>
                <td>{user.user_name}</td>
                <td>{user.user_email}</td>
                <td>{user.user_phone}</td>
                <td>{user.user_address}</td>
                <td>{user.role}</td>
                <td>
                  <div className="btn-group">
                    {/* <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => onEditUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => onDeleteUser(user)}
                    >
                      Delete
                    </button> */}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr className="align-middle">
              <td colSpan={9} className="text-center">
                No Users Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default UsersTable;
