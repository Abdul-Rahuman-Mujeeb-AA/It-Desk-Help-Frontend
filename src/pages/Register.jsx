import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

import { registerUser } from "../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name) {
      toast.error("Please enter your name.");
      return false;
    }

    if (name.length < 2) {
      toast.error("Name must be at least 2 characters.");
      return false;
    }

    if (!email) {
      toast.error("Please enter your email.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (!password) {
      toast.error("Please enter a password.");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      toast.success("Registration successful. Please login.");

      // Registration should go to Login page.
      navigate("/login", { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Left Side - Registration Form */}
        <div className="flex items-center justify-center w-full px-4 py-8 sm:px-6 lg:w-1/2 lg:px-10 xl:px-16">
          <div className="w-full max-w-md">
            {/* Logo / Heading */}
            <div className="mb-7 text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-14 h-14 mb-4 bg-blue-600 rounded-xl shadow-sm">
                <span className="text-xl font-bold text-white">IT</span>
              </div>

              <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                Create Your Account
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Register to access the IT Help Desk Portal
              </p>
            </div>

            {/* Register Card */}
            <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl sm:p-7 lg:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Get Started
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter your details to create an account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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
                      size={15}
                    />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      disabled={loading}
                      className="
                        w-full
                        pl-11 pr-4
                        py-3
                        text-sm
                        text-gray-800
                        placeholder-gray-400
                        bg-white
                        border border-gray-300
                        rounded-lg
                        outline-none
                        transition
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                        disabled:bg-gray-100
                      "
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
                      size={15}
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      autoComplete="email"
                      disabled={loading}
                      className="
                        w-full
                        pl-11 pr-4
                        py-3
                        text-sm
                        text-gray-800
                        placeholder-gray-400
                        bg-white
                        border border-gray-300
                        rounded-lg
                        outline-none
                        transition
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                        disabled:bg-gray-100
                      "
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <FaLock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={15}
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      autoComplete="new-password"
                      disabled={loading}
                      className="
                        w-full
                        pl-11 pr-12
                        py-3
                        text-sm
                        text-gray-800
                        placeholder-gray-400
                        bg-white
                        border border-gray-300
                        rounded-lg
                        outline-none
                        transition
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                        disabled:bg-gray-100
                      "
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={loading}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        hover:text-blue-600
                      "
                    >
                      {showPassword ? (
                        <FaEyeSlash size={15} />
                      ) : (
                        <FaEye size={15} />
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
                      size={15}
                    />

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      disabled={loading}
                      className="
                        w-full
                        pl-11 pr-12
                        py-3
                        text-sm
                        text-gray-800
                        placeholder-gray-400
                        bg-white
                        border border-gray-300
                        rounded-lg
                        outline-none
                        transition
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                        disabled:bg-gray-100
                      "
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      disabled={loading}
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        hover:text-blue-600
                      "
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash size={15} />
                      ) : (
                        <FaEye size={15} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    flex
                    items-center
                    justify-center
                    w-full
                    gap-2
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    bg-blue-600
                    rounded-lg
                    shadow-sm
                    hover:bg-blue-700
                    active:bg-blue-800
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    transition
                  "
                >
                  <FaUserPlus />

                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              {/* Login Link */}
              <div className="pt-5 mt-6 text-sm text-center border-t border-gray-100">
                <span className="text-gray-500">Already have an account?</span>{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Footer */}
            <p className="mt-6 text-xs text-center text-gray-400">
              © {new Date().getFullYear()} IT Help Desk. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="relative hidden lg:flex lg:w-1/2">
          <img
            src="/src/assets/images/login-bg.jpg"
            alt="IT Help Desk Support"
            className="absolute inset-0 object-cover w-full h-full"
          />

          <div className="absolute inset-0 bg-blue-900/70" />

          <div className="relative z-10 flex items-center justify-center w-full px-10 xl:px-20">
            <div className="max-w-lg text-center text-white">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-white/20 rounded-2xl backdrop-blur-sm">
                <FaUserPlus size={28} />
              </div>

              <h2 className="text-3xl font-bold xl:text-4xl">
                Welcome to IT Support
              </h2>

              <p className="mt-5 text-base leading-7 text-blue-100 xl:text-lg">
                Create your account and manage IT support requests quickly and
                efficiently through one centralized help desk portal.
              </p>

              <div className="grid grid-cols-3 gap-4 mt-10">
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                  <p className="text-2xl font-bold">Easy</p>
                  <p className="mt-1 text-xs text-blue-100">Ticket Creation</p>
                </div>

                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                  <p className="text-2xl font-bold">Live</p>
                  <p className="mt-1 text-xs text-blue-100">Status Tracking</p>
                </div>

                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                  <p className="text-2xl font-bold">Secure</p>
                  <p className="mt-1 text-xs text-blue-100">User Access</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
