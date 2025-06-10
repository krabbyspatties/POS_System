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
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fa" }}>
      {/* Sidebar Filter */}
      <div
        style={{
          width: 260,
          background: "linear-gradient(180deg, #000000 0%, #8B0000 100%)",
          color: "#fff",
          padding: 20,
          fontSize: "1.1rem",
          fontWeight: 500,
          position: "sticky",
          top: 0,
          height: "100vh",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        }}
      >
        <h5 style={{ marginBottom: 16 }}>🔍 Advanced Filter</h5>
        <input
          type="text"
          placeholder="Search by name"
          className="form-control mb-3"
          value={filter.name}
          onChange={(e) => setFilter((f) => ({ ...f, name: e.target.value }))}
        />
        <select
          className="form-select mb-3"
          value={filter.role}
          onChange={(e) => setFilter((f) => ({ ...f, role: e.target.value }))}
        >
          <option value="">All Roles</option>
          <option value="administrator">Administrator</option>
          <option value="cashier">Cashier</option>
          <option value="manager">Manager</option>
        </select>
        <button
          className="btn btn-light w-100"
          style={{
            border: "2px solid #8B0000",
            fontWeight: "bold",
            color: "#8B0000",
            backgroundColor: "#fff",
          }}
          onClick={() => setFilter({ name: "", role: "" })}
        >
          Reset Filters
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: 32, fontSize: "1rem", color: "#333" }}>
        {/* Header Action */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 16,
          }}
        >
          <button
            className="btn"
            style={{
              background: "linear-gradient(90deg, #198754 0%, #146c43 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontWeight: "600",
              padding: "8px 16px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
            onClick={() => setShowAddUserModal(true)}
          >
            + Add User
          </button>
        </div>

        {/* Table Container */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: 24,
          }}
        >
          <table className="table table-hover mb-0" style={{ width: "100%" }}>
            <thead className="table-light">
              <tr style={{ fontSize: "1.05rem" }}>
                <th>No.</th>
                <th>Image</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.loadingUsers ? (
                <tr>
                  <td colSpan={9} className="text-center">
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
                          <div>
                            <img
                              src={`http://localhost:8000/storage/${user.user_image}`}
                              alt={user.user_name}
                              className="rounded-circle img-thumbnail"
                              style={{
                                width: 64,
                                height: 64,
                                objectFit: "cover",
                                borderRadius: "50%",
                                cursor: "pointer",
                                border: "2px solid #8B0000",
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              width: 64,
                              height: 64,
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
                        <div className="btn-group" style={{ gap: 6 }}>
                          <button
                            type="button"
                            className="btn btn-sm"
                            style={{
                              backgroundColor: "#0d6efd", // blue (items table style)
                              color: "#fff",
                              border: "none",
                              fontWeight: "bold",
                            }}
                            onClick={() => onEditUser(user)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm"
                            style={{
                              backgroundColor: "#dc3545", // red (items table style)
                              color: "#fff",
                              border: "none",
                              fontWeight: "bold",
                            }}
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
                  <td colSpan={9} className="text-center">
                    No Users Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddUserModal && (
        <AddUserModal
          showModal={showAddUserModal}
          onRefreshUsers={handleRefreshUsers}
          onClose={() => setShowAddUserModal(false)}
        />
      )}
    </div>
  );
};

export default UsersTable;
