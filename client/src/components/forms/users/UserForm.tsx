import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

type User = {
  user_id: number;
  first_name: string;
  last_name: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  user_address?: string;
  user_image?: string;
  role: 'cashier' | 'manager' | 'administrator';
};

interface UserFormProps {
  setSubmitForm?: React.MutableRefObject<(() => void) | null>;
  setLoadingStore?: React.Dispatch<React.SetStateAction<boolean>>;
  onUserAdded?: (message: string) => void;
}

const UserForm: React.FC<UserFormProps> = ({
  setSubmitForm,
  setLoadingStore,
  onUserAdded,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<any>({});
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const fetchUsers = async () => {
    const res = await axios.get(`${API_BASE}/users`);
    setUsers(res.data.users);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (setLoadingStore) setLoadingStore(true);
    try {
      if (editingUserId) {
        await axios.put(`${API_BASE}/users/${editingUserId}`, form);
        if (onUserAdded) onUserAdded('User updated successfully!');
      } else {
        await axios.post(`${API_BASE}/users`, {
          ...form,
          user_password_confirmation: form.user_password,
        });
        if (onUserAdded) onUserAdded('User added successfully!');
      }
      setForm({});
      setEditingUserId(null);
      fetchUsers();
    } catch (err: any) {
      if (onUserAdded) onUserAdded(err?.response?.data?.message || 'Error occurred');
    } finally {
      if (setLoadingStore) setLoadingStore(false);
    }
  };

  useEffect(() => {
    if (setSubmitForm) {
      setSubmitForm.current = handleSubmit;
    }
    return () => {
      if (setSubmitForm) setSubmitForm.current = null;
    };
    // eslint-disable-next-line
  }, [form, editingUserId]);

  const handleEdit = (user: User) => {
    setForm(user);
    setEditingUserId(user.user_id);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`${API_BASE}/users/${id}`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-8 bg-gray-100 p-8 rounded-lg shadow-lg max-w-5xl mx-auto mt-8">
      {/* User Form */}
      <div className="w-full md:w-1/2 bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
          <span className="inline-block bg-blue-100 rounded-full p-2">
            <svg width="24" height="24" fill="none" stroke="currentColor" className="text-blue-500" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" />
              <path d="M12 14c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" />
            </svg>
          </span>
          {editingUserId ? 'Edit User' : 'Create User'}
        </h1>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="flex gap-2">
            <input
              name="first_name"
              placeholder="First Name"
              className="input input-bordered flex-1"
              value={form.first_name || ''}
              onChange={handleChange}
              autoComplete="off"
            />
            <input
              name="last_name"
              placeholder="Last Name"
              className="input input-bordered flex-1"
              value={form.last_name || ''}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <input
            name="user_name"
            placeholder="Username"
            className="input input-bordered"
            value={form.user_name || ''}
            onChange={handleChange}
            autoComplete="off"
          />
          <input
            name="user_email"
            type="email"
            placeholder="Email"
            className="input input-bordered"
            value={form.user_email || ''}
            onChange={handleChange}
            autoComplete="off"
          />
          {!editingUserId && (
            <div className="flex gap-2">
              <input
                name="user_password"
                type="password"
                placeholder="Password"
                className="input input-bordered flex-1"
                value={form.user_password || ''}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <input
                name="user_password_confirmation"
                type="password"
                placeholder="Confirm Password"
                className="input input-bordered flex-1"
                value={form.user_password_confirmation || ''}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
          )}
          <input
            name="user_phone"
            placeholder="Phone"
            className="input input-bordered"
            value={form.user_phone || ''}
            onChange={handleChange}
            autoComplete="off"
          />
          <input
            name="user_address"
            placeholder="Address"
            className="input input-bordered"
            value={form.user_address || ''}
            onChange={handleChange}
            autoComplete="off"
          />
          <input
            name="user_image"
            placeholder="Image URL"
            className="input input-bordered"
            value={form.user_image || ''}
            onChange={handleChange}
            autoComplete="off"
          />
          <select
            name="role"
            className="input input-bordered"
            value={form.role || ''}
            onChange={handleChange}
          >
            <option value="">Select Role</option>
            <option value="cashier">Cashier</option>
            <option value="manager">Manager</option>
            <option value="administrator">Administrator</option>
          </select>
          <button
            type="submit"
            className="btn bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          >
            {editingUserId ? 'Update User' : 'Create User'}
          </button>
        </form>
      </div>

      {/* User List */}
      <div className="w-full md:w-1/2 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center gap-2">
          <span className="inline-block bg-blue-100 rounded-full p-2">
            <svg width="22" height="22" fill="none" stroke="currentColor" className="text-blue-500" viewBox="0 0 22 22">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </span>
          User List
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded">
            <thead>
              <tr className="bg-blue-50 text-blue-700">
                <th className="py-2 px-3 text-left">Name</th>
                <th className="py-2 px-3 text-left">Role</th>
                <th className="py-2 px-3 text-left">Email</th>
                <th className="py-2 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.user_id} className="border-t border-gray-100 hover:bg-blue-50">
                  <td className="py-2 px-3 flex items-center gap-2">
                    {u.user_image && (
                      <img
                        src={u.user_image}
                        alt={u.first_name}
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                    )}
                    <span>{u.first_name} {u.last_name}</span>
                  </td>
                  <td className="py-2 px-3 capitalize">{u.role}</td>
                  <td className="py-2 px-3">{u.user_email}</td>
                  <td className="py-2 px-3 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(u)}
                      className="btn btn-xs bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u.user_id)}
                      className="btn btn-xs bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
