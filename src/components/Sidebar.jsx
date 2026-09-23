import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaTasks,
  FaUser,
  FaUsers,
  FaClipboardList,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isAdmin = user.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    onClose?.();
    navigate("/login");
  };

  const userLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: FaHome,
    },
    {
      name: "My Tickets",
      path: "/dashboard",
      icon: FaTasks,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: FaUser,
    },
  ];

  const adminLinks = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: FaHome,
    },
    {
      name: "Manage Tickets",
      path: "/manage-tickets",
      icon: FaClipboardList,
    },
    {
      name: "Manage Users",
      path: "/manage-users",
      icon: FaUsers,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: FaUser,
    },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          flex flex-col
          w-64 h-screen
          bg-white border-r border-gray-200
          shadow-lg lg:shadow-none
          transform transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 bg-blue-600 rounded-lg">
              <span className="font-bold text-white">IT</span>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-800">
                Help Desk
              </h2>

              <p className="text-xs text-gray-500">
                {isAdmin ? "Admin Panel" : "Support Portal"}
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* User Info */}
        <div className="px-4 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
              <FaUser className="text-blue-600" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user.name || "User"}
              </p>

              <p className="text-xs text-gray-500 capitalize">
                {user.role || "user"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto">
          <p className="px-3 mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Menu
          </p>

          <div className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3
                    px-4 py-3
                    rounded-lg
                    text-sm font-medium
                    transition-colors
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                    `
                  }
                >
                  <Icon size={17} />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="
              flex items-center w-full gap-3
              px-4 py-3
              text-sm font-medium text-red-600
              rounded-lg
              hover:bg-red-50
              transition-colors
            "
          >
            <FaSignOutAlt size={17} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;