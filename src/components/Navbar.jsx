import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaSignOutAlt,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const profileImage = user.profileImage
    ? `your.onrender.com/uploads/${user.profileImage}`
    : null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 lg:hidden"
            aria-label="Open menu"
          >
            <FaBars size={20} />
          </button>

          {/* Logo */}
          <Link
            to={user.role === "admin" ? "/admin" : "/dashboard"}
            className="flex items-center gap-2"
          >
            <div className="flex items-center justify-center w-9 h-9 bg-blue-600 rounded-lg">
              <span className="text-lg font-bold text-white">IT</span>
            </div>

            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-800">
                IT Help Desk
              </h1>
              <p className="hidden text-xs text-gray-500 md:block">
                Support Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notification */}
          <button
            className="relative p-2 text-gray-600 rounded-full hover:bg-gray-100"
            aria-label="Notifications"
          >
            <FaBell size={18} />

            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="object-cover w-9 h-9 rounded-full"
                />
              ) : (
                <FaUserCircle className="text-gray-500" size={34} />
              )}

              <div className="hidden text-left md:block">
                <p className="text-sm font-semibold text-gray-800">
                  {user.name || "User"}
                </p>

                <p className="text-xs text-gray-500 capitalize">
                  {user.role || "user"}
                </p>
              </div>
            </button>

            {/* Dropdown */}
            {showMenu && (
              <div className="absolute right-0 w-52 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg">
                {/* Close button on mobile */}
                <div className="flex items-center justify-between px-4 py-3 border-b md:hidden">
                  <span className="text-sm font-semibold text-gray-700">
                    Account
                  </span>

                  <button
                    onClick={() => setShowMenu(false)}
                    className="text-gray-500"
                  >
                    <FaTimes />
                  </button>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setShowMenu(false)}
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <FaUserCircle className="inline mr-2" />
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-sm text-left text-red-600 hover:bg-red-50"
                >
                  <FaSignOutAlt className="inline mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
