import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaUsers, FaUserShield } from "react-icons/fa";
import { toast } from "react-hot-toast";

import UserTable from "../components/UserTable";
import Modal from "../components/Modal";
import Loader from "../components/Loader";

import {
  getAllUsers,
  updateUser,
  deleteUser,
} from "../services/adminService";

const getUsersFromResponse = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response?.data?.users)) {
    return response.data.users;
  }

  if (Array.isArray(response?.users)) {
    return response.users;
  }

  return [];
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "user",
  });

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await getAllUsers();
      const userList = getUsersFromResponse(response);

      setUsers(userList);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      if (cancelled) {
        return;
      }

      await loadUsers();
    };

    const timer = setTimeout(() => {
      initialize();
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  /*
   * Do NOT use setFilteredUsers() inside useEffect.
   * filteredUsers is derived from users, search and roleFilter.
   */
  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      const userName = user?.name?.toLowerCase() || "";
      const userEmail = user?.email?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        userName.includes(searchValue) ||
        userEmail.includes(searchValue);

      const matchesRole =
        roleFilter === "all" || user?.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const totalUsers = users.length;

  const totalAdmins = useMemo(() => {
    return users.filter((user) => user?.role === "admin").length;
  }, [users]);

  const totalRegularUsers = useMemo(() => {
    return users.filter((user) => user?.role === "user").length;
  }, [users]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value);
  };

  const handleEdit = (user) => {
    if (!user) {
      return;
    }

    setSelectedUser(user);

    setFormData({
      name: user?.name || "",
      role: user?.role || "user",
    });

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (saveLoading) {
      return;
    }

    setIsModalOpen(false);
    setSelectedUser(null);

    setFormData({
      name: "",
      role: "user",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedUser?._id) {
      toast.error("User not found");
      return;
    }

    const name = formData.name.trim();

    if (!name) {
      toast.error("Name is required");
      return;
    }

    try {
      setSaveLoading(true);

      const response = await updateUser(selectedUser._id, {
        name,
        role: formData.role,
      });

      const updatedUser =
        response?.data?.data ||
        response?.data?.user ||
        response?.user ||
        {};

      setUsers((previousUsers) =>
        previousUsers.map((user) => {
          if (user._id !== selectedUser._id) {
            return user;
          }

          return {
            ...user,
            ...updatedUser,
            name,
            role: formData.role,
          };
        })
      );

      toast.success("User updated successfully");

      setIsModalOpen(false);
      setSelectedUser(null);

      setFormData({
        name: "",
        role: "user",
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update user"
      );
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (user) => {
    if (!user?._id) {
      toast.error("User not found");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        user?.name || "this user"
      }?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteUser(user._id);

      setUsers((previousUsers) =>
        previousUsers.filter(
          (currentUser) => currentUser._id !== user._id
        )
      );

      toast.success("User deleted successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete user"
      );
    }
  };

  if (loading) {
    return <Loader text="Loading users..." />;
  }

  return (
    <section className="w-full space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FaUsers className="text-lg" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
              Manage Users
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View and manage help desk portal users
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {/* Total Users */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Users
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {totalUsers}
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FaUsers />
            </div>
          </div>
        </div>

        {/* Administrators */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Administrators
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {totalAdmins}
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <FaUserShield />
            </div>
          </div>
        </div>

        {/* Regular Users */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Regular Users
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {totalRegularUsers}
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <FaUsers />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative w-full flex-1">
            <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by name or email..."
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                py-2.5
                pl-10
                pr-4
                text-sm
                text-gray-800
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>

          {/* Role Filter */}
          <div className="w-full lg:w-56">
            <select
              value={roleFilter}
              onChange={handleRoleFilterChange}
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                px-3
                py-2.5
                text-sm
                text-gray-700
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrators</option>
              <option value="user">Regular Users</option>
            </select>
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-500 sm:text-sm">
          Showing{" "}
          <span className="font-semibold text-gray-700">
            {filteredUsers.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700">
            {users.length}
          </span>{" "}
          users
        </p>
      </div>

      {/* Users */}
      {filteredUsers.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <UserTable
            users={filteredUsers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <FaUsers className="text-xl" />
          </div>

          <h2 className="mt-4 text-base font-semibold text-gray-800 sm:text-lg">
            No users found
          </h2>

          <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
            Try changing your search text or role filter.
          </p>
        </div>
      )}

      {/* Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Edit User"
        size="small"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="user-name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>

            <input
              id="user-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              disabled={saveLoading}
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                px-3
                py-2.5
                text-sm
                text-gray-800
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
                disabled:cursor-not-allowed
                disabled:bg-gray-100
              "
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="user-email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="user-email"
              type="email"
              value={selectedUser?.email || ""}
              disabled
              className="
                w-full
                cursor-not-allowed
                rounded-lg
                border
                border-gray-200
                bg-gray-100
                px-3
                py-2.5
                text-sm
                text-gray-500
                outline-none
              "
            />
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="user-role"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Role
            </label>

            <select
              id="user-role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={saveLoading}
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                px-3
                py-2.5
                text-sm
                text-gray-700
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
                disabled:cursor-not-allowed
                disabled:bg-gray-100
              "
            >
              <option value="user">Regular User</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={saveLoading}
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                px-4
                py-2.5
                text-sm
                font-medium
                text-gray-700
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:w-auto
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saveLoading}
              className="
                w-full
                rounded-lg
                bg-blue-600
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60
                sm:w-auto
              "
            >
              {saveLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
};

export default ManageUsers;