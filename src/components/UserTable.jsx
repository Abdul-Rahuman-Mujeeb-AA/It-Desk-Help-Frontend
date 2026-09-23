import { FaEdit, FaTrash, FaUser, FaUserShield } from "react-icons/fa";

const UserTable = ({ users = [], onEdit, onDelete }) => {
  const getRoleStyle = (role) => {
    return role === "admin"
      ? "bg-purple-100 text-purple-700"
      : "bg-blue-100 text-blue-700";
  };

  return (
    <div className="w-full overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
      {/* Desktop / Tablet Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-4 font-semibold text-gray-600">User</th>

              <th className="px-4 py-4 font-semibold text-gray-600">Email</th>

              <th className="px-4 py-4 font-semibold text-gray-600">Role</th>

              <th className="px-4 py-4 font-semibold text-gray-600">Created</th>

              <th className="px-4 py-4 font-semibold text-right text-gray-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  {/* User */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center shrink-0 w-10 h-10 bg-blue-100 rounded-full">
                        {user.role === "admin" ? (
                          <FaUserShield className="text-purple-600" />
                        ) : (
                          <FaUser className="text-blue-600" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {user.name || "Unknown User"}
                        </p>

                        <p className="text-xs text-gray-400">
                          ID: {user._id?.slice(-6) || "N/A"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-4 text-gray-600">
                    <span className="block max-w-xs truncate">
                      {user.email || "N/A"}
                    </span>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-4">
                    <span
                      className={`
                        inline-flex items-center
                        px-3 py-1
                        text-xs font-medium
                        rounded-full
                        capitalize
                        ${getRoleStyle(user.role)}
                      `}
                    >
                      {user.role || "user"}
                    </span>
                  </td>

                  {/* Created */}
                  <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-IN")
                      : "N/A"}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit?.(user)}
                        className="
                          flex items-center justify-center
                          w-9 h-9
                          text-blue-600
                          rounded-lg
                          hover:bg-blue-50
                          transition
                        "
                        title="Edit user"
                      >
                        <FaEdit size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete?.(user)}
                        className="
                          flex items-center justify-center
                          w-9 h-9
                          text-red-600
                          rounded-lg
                          hover:bg-red-50
                          transition
                        "
                        title="Delete user"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-10 text-center text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="divide-y divide-gray-100 md:hidden">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className="p-4">
              {/* User Information */}
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center shrink-0 w-11 h-11 bg-blue-100 rounded-full">
                  {user.role === "admin" ? (
                    <FaUserShield className="text-purple-600" />
                  ) : (
                    <FaUser className="text-blue-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-800 truncate">
                        {user.name || "Unknown User"}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500 break-all">
                        {user.email || "N/A"}
                      </p>
                    </div>

                    <span
                      className={`
                        self-start
                        px-3 py-1
                        text-xs font-medium
                        rounded-full
                        capitalize
                        ${getRoleStyle(user.role)}
                      `}
                    >
                      {user.role || "user"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Details */}
              <div className="flex flex-col gap-2 mt-4 text-xs text-gray-500">
                <p>
                  <span className="font-medium text-gray-600">User ID:</span>{" "}
                  {user._id || "N/A"}
                </p>

                <p>
                  <span className="font-medium text-gray-600">Created:</span>{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-IN")
                    : "N/A"}
                </p>
              </div>

              {/* Mobile Actions */}
              <div className="flex gap-2 pt-4 mt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => onEdit?.(user)}
                  className="
                    flex items-center justify-center flex-1 gap-2
                    px-4 py-2.5
                    text-sm font-medium
                    text-blue-600
                    bg-blue-50
                    rounded-lg
                    hover:bg-blue-100
                    transition
                  "
                >
                  <FaEdit size={14} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDelete?.(user)}
                  className="
                    flex items-center justify-center flex-1 gap-2
                    px-4 py-2.5
                    text-sm font-medium
                    text-red-600
                    bg-red-50
                    rounded-lg
                    hover:bg-red-100
                    transition
                  "
                >
                  <FaTrash size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-10 text-center text-gray-500">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTable;
