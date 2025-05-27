import { useState } from "react";
import MainLayout from "../../layout/MainLayout";
import AddUserModal from "../../modals/user/AddUserModal";
import type { Users } from "../../../interfaces/User/Users";
import UsersTable from "../../table/user/UsersTable";
import EditUserModal from "../../modals/user/EditUserModal";
import DeleteUserModal from "../../modals/user/DeleteUserModal";

const UsersPage = () => {
  const [refreshUsers, setRefreshUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [openEditUserModal, setOpenEditUserModal] = useState(false);
  const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);

  const handleOpenEditUserModal = (user: Users) => {
    setSelectedUser(user);
    setOpenEditUserModal(true);
  };

  const handleCloseEditUserModal = () => {
    setSelectedUser(null);
    setOpenEditUserModal(false);
  };

  const handleOpenDeleteUserModal = (user: Users) => {
    setSelectedUser(user);
    setOpenDeleteUserModal(true);
  };

  const handleCloseDeleteUserModal = () => {
    setSelectedUser(null);
    setOpenDeleteUserModal(false);
  };

  const content = (
    <>
      {openAddUserModal && (
        <AddUserModal
          showModal={true}
          onRefreshUsers={() => setRefreshUsers(!refreshUsers)}
          onClose={() => setOpenAddUserModal(false)}
        />
      )}
      {openEditUserModal && (
        <EditUserModal
          showModal={true}
          user={selectedUser}
          onRefreshUsers={() => setRefreshUsers(!refreshUsers)}
          onClose={handleCloseEditUserModal}
        />
      )}
      <DeleteUserModal
        showModal={openDeleteUserModal}
        user={selectedUser}
        onRefreshUsers={() => setRefreshUsers(!refreshUsers)}
        onClose={handleCloseDeleteUserModal}
      />
      <div className="d-flex justify-content-end mt-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setOpenAddUserModal(true)}
        >
          Add User
        </button>
      </div>
      <UsersTable
        refreshUsers={refreshUsers}
        onEditUser={handleOpenEditUserModal}
        onDeleteUser={handleOpenDeleteUserModal}
      />
    </>
  );

  return <MainLayout content={content} />;
};

export default UsersPage;
