import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaCamera,
  FaSave,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  updateUserProfile,
  changePassword,
  deleteAccount,
} from "../services/userService";

const BACKEND_URL = "https://your-backend.onrender.com";

const Profile = () => {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Helper function to get the profile image URL
  const getProfileImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `${BACKEND_URL}/uploads/${image}`;
  };

  // Profile state
  const [profile, setProfile] = useState({
    name: storedUser?.name || "",
    email: storedUser?.email || "",
    profileImage: storedUser?.profileImage || "",
  });

  const [imageFile, setImageFile] = useState(null);

  const [imagePreview, setImagePreview] = useState(
    getProfileImageUrl(storedUser?.profileImage)
  );

  // Loading states
  const [saveLoading, setSaveLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

 // Password fields
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handlers
  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Password change handlers
  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Image change handler
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPG, JPEG, PNG, or GIF image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // Save profile handler
  const handleSaveProfile = async (event) => {
    event.preventDefault();

    const name = profile.name.trim();

    if (!name) {
      toast.error("Please enter your name.");
      return;
    }

    if (name.length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }

    try {
      setSaveLoading(true);

      const formData = new FormData();

      formData.append("name", name);

      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      const response = await updateUserProfile(formData);

      const updatedUser =
        response?.data?.data?.user ||
        response?.data?.user ||
        response?.data?.data ||
        response?.data;

      if (updatedUser) {
        const newProfile = {
          name: updatedUser.name || "",
          email: updatedUser.email || "",
          profileImage: updatedUser.profileImage || "",
        };

        setProfile(newProfile);

        localStorage.setItem("user", JSON.stringify(updatedUser));

        if (updatedUser.profileImage) {
          setImagePreview(getProfileImageUrl(updatedUser.profileImage));
        }
      } else {
        const updatedLocalUser = {
          ...storedUser,
          name,
        };

        setProfile((previous) => ({
          ...previous,
          name,
        }));

        localStorage.setItem("user", JSON.stringify(updatedLocalUser));
      }

      setImageFile(null);

      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setSaveLoading(false);
    }
  };

// Change password handler
  const handleChangePassword = async (event) => {
    event.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different from current password.");
      return;
    }

    try {
      setPasswordLoading(true);

      await changePassword({
        currentPassword,
        newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      toast.success("Password changed successfully.");
    } catch (error) {
      console.error("Password change error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to change password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(true);

      await deleteAccount();

      // Clear local storage and navigate to login page

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      toast.success("Account deleted successfully.");

      // Redirect to login page
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Delete account error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to delete account."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-gray-500 sm:text-base">
          Manage your profile information and account settings.
        </p>
      </div>

      {/* Profile Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl sm:p-6">
          <div className="flex flex-col items-center text-center">
            {/* Profile Image */}
            <div className="relative">
              <div className="flex items-center justify-center w-28 h-28 overflow-hidden bg-blue-100 border-4 border-white rounded-full shadow sm:w-32 sm:h-32">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <FaUser className="text-4xl text-blue-600" />
                )}
              </div>

              {/* Camera Button */}
              <label
                htmlFor="profileImage"
                className="absolute bottom-0 right-0 flex items-center justify-center w-9 h-9 text-white bg-blue-600 border-2 border-white rounded-full cursor-pointer hover:bg-blue-700 transition"
              >
                <FaCamera size={14} />

                <input
                  id="profileImage"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={saveLoading}
                />
              </label>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-800">
              {profile.name || "User"}
            </h2>

            <p className="mt-1 text-sm text-gray-500 break-all">
              {profile.email}
            </p>

            <span className="px-3 py-1 mt-3 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
              {storedUser?.role === "admin" ? "Administrator" : "User"}
            </span>
          </div>

          <div className="pt-5 mt-6 border-t border-gray-100">
            <p className="text-xs leading-5 text-center text-gray-400">
              Supported formats: JPG, JPEG, PNG, GIF
              <br />
              Maximum file size: 5 MB
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl sm:p-6 lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your personal account information.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Full Name
              </label>

              <div className="relative">
                <FaUser
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={14}
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={profile.name}
                  onChange={handleProfileChange}
                  disabled={saveLoading}
                  placeholder="Enter your full name"
                  className="w-full py-3 pl-11 pr-4 text-sm text-gray-800 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <div className="relative">
                <FaEnvelope
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={14}
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full py-3 pl-11 pr-4 text-sm text-gray-500 bg-gray-100 border border-gray-300 rounded-lg outline-none cursor-not-allowed"
                />
              </div>

              <p className="mt-1 text-xs text-gray-400">
                Email address cannot be changed.
              </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saveLoading}
                className="inline-flex items-center justify-center w-full gap-2 px-5 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition sm:w-auto"
              >
                <FaSave />
                {saveLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Change Password */}
      <div className="p-5 mt-6 bg-white border border-gray-200 shadow-sm rounded-xl sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Change Password
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Keep your account secure by using a strong password.
          </p>
        </div>

        <form
          onSubmit={handleChangePassword}
          className="grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {/* Current Password */}
          <div>
            <label
              htmlFor="currentPassword"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Current Password
            </label>

            <div className="relative">
              <FaLock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={14}
              />

              <input
                id="currentPassword"
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                disabled={passwordLoading}
                placeholder="Current password"
                className="w-full py-3 pl-11 pr-11 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrentPassword((previous) => !previous)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                aria-label="Toggle current password visibility"
              >
                {showCurrentPassword ? (
                  <FaEyeSlash size={14} />
                ) : (
                  <FaEye size={14} />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              New Password
            </label>

            <div className="relative">
              <FaLock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={14}
              />

              <input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                disabled={passwordLoading}
                placeholder="New password"
                className="w-full py-3 pl-11 pr-11 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword((previous) => !previous)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                aria-label="Toggle new password visibility"
              >
                {showNewPassword ? (
                  <FaEyeSlash size={14} />
                ) : (
                  <FaEye size={14} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>

            <div className="relative">
              <FaLock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={14}
              />

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                disabled={passwordLoading}
                placeholder="Confirm password"
                className="w-full py-3 pl-11 pr-11 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((previous) => !previous)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash size={14} />
                ) : (
                  <FaEye size={14} />
                )}
              </button>
            </div>
          </div>

          {/* Change Password Button */}
          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={passwordLoading}
              className="inline-flex items-center justify-center w-full gap-2 px-5 py-3 text-sm font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed transition sm:w-auto"
            >
              <FaLock />
              {passwordLoading
                ? "Changing Password..."
                : "Change Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="p-5 mt-6 border border-red-200 bg-red-50 rounded-xl sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-red-700">Delete Account</h2>

            <p className="mt-1 text-sm text-red-600">
              Permanently delete your account and associated data. This action
              cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
            className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition sm:w-auto"
          >
            <FaTrash />
            {deleteLoading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
