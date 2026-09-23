import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";

import { loginUser } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({
        email,
        password,
      });

      const data = response?.data?.data || response?.data;

      const token = data?.token;
      const user = data?.user;

      if (!token || !user) {
        throw new Error("Invalid login response.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful.");

      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Left Side - Login Form */}
        <div className="flex items-center justify-center w-full px-4 py-8 sm:px-6 lg:w-1/2 lg:px-10 xl:px-16">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-8 text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-14 h-14 mb-4 bg-blue-600 rounded-xl shadow-sm">
                <span className="text-xl font-bold text-white">IT</span>
              </div>

              <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                IT Help Desk
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Sign in to access your support portal
              </p>
            </div>

            {/* Login Card */}
            <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl sm:p-7 lg:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Welcome Back
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter your account details below.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
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
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <FaLock
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                      size={15}
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={loading}
                      className="
                        w-full
                        pl-11 pr-20
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
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        px-2
                        py-1
                        text-xs
                        font-medium
                        text-blue-600
                        hover:text-blue-700
                      "
                    >
                      {showPassword ? "Hide" : "Show"}
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
                  <FaSignInAlt />

                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              {/* Register */}
              <div className="pt-5 mt-6 text-sm text-center border-t border-gray-100">
                <span className="text-gray-500">Don't have an account?</span>{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Create Account
                </Link>
              </div>
            </div>

            {/* Footer */}
            <p className="mt-6 text-xs text-center text-gray-400">
              © {new Date().getFullYear()} IT Help Desk. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Side - Background */}
        <div className="relative hidden lg:flex lg:w-1/2">
          <img
            src="src/assets/images/login-bg.jpg"
            alt="IT Help Desk"
            className="absolute inset-0 object-cover w-full h-full"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-blue-900/70" />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center w-full px-10 xl:px-20">
            <div className="max-w-lg text-center text-white">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-white/20 rounded-2xl backdrop-blur-sm">
                <FaSignInAlt size={28} />
              </div>

              <h2 className="text-3xl font-bold xl:text-4xl">
                IT Support Made Simple
              </h2>

              <p className="mt-5 text-base leading-7 text-blue-100 xl:text-lg">
                Submit support tickets, track your requests, and get help from
                your IT support team from one central portal.
              </p>

              <div className="grid grid-cols-3 gap-4 mt-10">
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="mt-1 text-xs text-blue-100">Support</p>
                </div>

                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                  <p className="text-2xl font-bold">Fast</p>
                  <p className="mt-1 text-xs text-blue-100">Response</p>
                </div>

                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                  <p className="text-2xl font-bold">Easy</p>
                  <p className="mt-1 text-xs text-blue-100">Tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
