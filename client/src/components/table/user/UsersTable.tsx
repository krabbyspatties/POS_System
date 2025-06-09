// ...other imports remain unchanged

import AddUserModal from "../../modals/user/AddUserModal";
import Spinner from "../../Spinner";
import UserService from "../../../services/UserService";
import ErrorHandler from "../../handler/ErrorHandler";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


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
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}


// ...imports stay the same

const UsersTable = ({ refreshUsers, onEditUser, onDeleteUser }: UsersTableProps) => {
  const [state, setState] = useState({ loadingUsers: true, users: [] as User[] });
  const [filter, setFilter] = useState({ name: "", role: "" });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [internalRefresh, setInternalRefresh] = useState(false);

  const handleLoadUsers = () => {
    setState((prevState) => ({ ...prevState, loadingUsers: true }));
    UserService.loadUsers()
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({ ...prevState, users: res.data.users }));
        }
      })
      .catch((error) => ErrorHandler(error, null))
      .finally(() => {
        setState((prevState) => ({ ...prevState, loadingUsers: false }));
      });
  };

  useEffect(() => {
    handleLoadUsers();
  }, [refreshUsers, internalRefresh]);

  const handleRefreshUsers = () => setInternalRefresh((prev) => !prev);

  const filteredUsers = state.users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return (
      (filter.name === "" || fullName.includes(filter.name.toLowerCase())) &&
      (filter.role === "" || user.role === filter.role)
    );
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f9f9f9", padding: 32 }}>
      {/* Top Bar with Filters & Add Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
            background: "#ffffff",
            padding: "12px 16px",
            borderRadius: "12px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            border: "1px solid #ddd",
          }}
        >
          <input
            type="text"
            className="form-control"
            style={{ width: 200 }}
            placeholder="Search by name"
            value={filter.name}
            onChange={(e) => setFilter((f) => ({ ...f, name: e.target.value }))}
          />
          <select
            className="form-select"
            style={{ width: 160 }}
            value={filter.role}
            onChange={(e) => setFilter((f) => ({ ...f, role: e.target.value }))}
          >
            <option value="">All Roles</option>
            <option value="administrator">Administrator</option>
            <option value="cashier">Cashier</option>
            <option value="manager">Manager</option>
          </select>
          <button className="btn btn-outline-secondary" onClick={() => setFilter({ name: "", role: "" })}>
            Reset
          </button>
        </div>

        {/* Add Button */}
        <button
          className="btn btn-primary"
          style={{ marginTop: "12px" }}
          onClick={() => setShowAddUserModal(true)}
        >
          + Add User
        </button>
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #e0e0e0",
          padding: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <table className="table" style={{ width: "100%", borderSpacing: "0 12px" }}>
          <thead>
            <tr style={{ fontSize: "1.05rem", color: "#555" }}>
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
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.user_id} className="align-middle" style={{ background: "#fff", borderBottom: "1px solid #eee" }}>
                  <td>{index + 1}</td>
                  <td>
                    {user.user_image ? (
                      <Link to={`/users/${user.user_id}`}>
                        <img
                          src={`http://localhost:8000/storage/${user.user_image}`}
                          alt={user.user_name}
                          className="rounded-circle"
                          style={{
                            width: 48,
                            height: 48,
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                        />
                      </Link>
                    ) : (
                      <div
                        style={{
                          width: 48,
                          height: 48,
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
                        user.user_status === "Active" ? "bg-success" : "bg-secondary"
                      }`}
                      style={{
                        fontSize: "0.85rem",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        textTransform: "uppercase",
                      }}
                    >
                      {user.user_status}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        style={{ borderRadius: "20px", marginRight: 6 }}
                        onClick={() => onEditUser(user)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        style={{ borderRadius: "20px" }}
                        onClick={() => onDeleteUser(user)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="align-middle">
                <td colSpan={10} className="text-center text-muted">
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
  );
};

export default UsersTable;

