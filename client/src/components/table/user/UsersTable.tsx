import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserService from "../../../services/UserService";
import ErrorHandler from "../../handler/ErrorHandler";
import Spinner from "../../Spinner";
import type { Users } from "../../../interfaces/User/Users";
import AddUserModal from "../../modals/user/AddUserModal";

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
  user_status: string;
}

interface UsersTableProps {
  refreshUsers: boolean;
  onEditUser: (user: Users) => void;
  onDeleteUser: (user: Users) => void;
}

const UsersTable = ({
  refreshUsers,
  onEditUser,
  onDeleteUser,
}: UsersTableProps) => {
  const [state, setState] = useState({
    loadingUsers: true,
    users: [] as User[],
  });

  const [filter, setFilter] = useState<{ name: string; role: string }>({
    name: "",
    role: "",
  });

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [internalRefresh, setInternalRefresh] = useState(false);

  const handleLoadUsers = () => {
    setState((prevState) => ({
      ...prevState,
      loadingUsers: true,
    }));
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
  }, [refreshUsers, internalRefresh]);

  const handleRefreshUsers = () => {
    setInternalRefresh((prev) => !prev);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div
        style={{
          width: 260,
          backgroundColor: "#007bff",
          color: "#fff",
          padding: 16,
          top: 100,
        }}
      >
        <h5>Advanced Filter</h5>
        <input
          type="text"
          placeholder="Search by name"
          className="form-control mb-2"
          value={filter.name}
          onChange={(e) => setFilter((f) => ({ ...f, name: e.target.value }))}
        />
        <select
          className="form-select mb-2"
          value={filter.role}
          onChange={(e) => setFilter((f) => ({ ...f, role: e.target.value }))}
        >
          <option value="">All Roles</option>
          <option value="administrator">Administrator</option>
          <option value="cashier">Cashier</option>
          <option value="manager">Manager</option>
        </select>
        <button
          className="btn btn-primary"
          style={{ border: "2px solid black" }}
          onClick={() => setFilter({ name: "", role: "" })}
        >
          Reset Filters
        </button>
      </div>

      <div style={{ flex: 1, padding: 32 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 16,
          }}
        >
          <button
            className="btn btn-primary btn-sm"
            style={{ marginRight: 8 }}
            onClick={() => setShowAddUserModal(true)}
          >
            Add User
          </button>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px #e0e0e0",
          }}
        >
          <table className="table table-hover mb-0" style={{ width: "100%" }}>
            <thead className="table-light">
              <tr>
                <th>No.</th>
                <th>Image</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.loadingUsers ? (
                <tr>
                  <td colSpan={10} className="text-center">
                    <Spinner />
                  </td>
                </tr>
              ) : state.users.filter(
                  (user) =>
                    (filter.name === "" ||
                      `${user.first_name} ${user.last_name}`
                        .toLowerCase()
                        .includes(filter.name.toLowerCase())) &&
                    (filter.role === "" || user.role === filter.role)
                ).length > 0 ? (
                state.users
                  .filter(
                    (user) =>
                      (filter.name === "" ||
                        `${user.first_name} ${user.last_name}`
                          .toLowerCase()
                          .includes(filter.name.toLowerCase())) &&
                      (filter.role === "" || user.role === filter.role)
                  )
                  .map((user, index) => (
                    <tr className="align-middle" key={user.user_id}>
                      <td>{index + 1}</td>
                      <td>
                        {user.user_image ? (
                          <Link to={`/users/${user.user_id}`}>
                            <img
                              src={`/storage/${user.user_image}`}
                              alt={`${user.first_name} ${user.last_name}`}
                              className="rounded-circle img-thumbnail"
                              style={{
                                width: 40,
                                height: 40,
                                objectFit: "cover",
                                borderRadius: "50%",
                                cursor: "pointer",
                              }}
                            />
                          </Link>
                        ) : (
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              backgroundColor: "#ccc",
                              display: "inline-block",
                            }}
                          />
                        )}
                      </td>
                      <td>{`${user.last_name}, ${user.first_name}`}</td>
                      <td>{user.user_name}</td>
                      <td>{user.user_email}</td>
                      <td>{user.user_phone}</td>
                      <td>{user.user_address}</td>
                      <td>{user.role}</td>
                      <td>
                        <span
                          className={`badge ${
                            user.user_status === "Active"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {user.user_status}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => onEditUser(user)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => onDeleteUser(user)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr className="align-middle">
                  <td colSpan={10} className="text-center">
                    No Users Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <AddUserModal
          showModal={showAddUserModal}
          onRefreshUsers={handleRefreshUsers}
          onClose={() => setShowAddUserModal(false)}
        />
      </div>
    </div>
  );
};

export default UsersTable;
