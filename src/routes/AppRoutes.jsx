import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import TicketDetails from "../pages/TicketDetails";

import AdminDashboard from "../pages/AdminDashboard";
import ManageTickets from "../pages/ManageTickets";
import ManageUsers from "../pages/ManageUsers";

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

import ProtectedLayout from "../components/ProtectedLayout";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected User Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tickets/:id" element={<TicketDetails />} />
        </Route>
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/manage-tickets" element={<ManageTickets />} />
          <Route path="/manage-users" element={<ManageUsers />} />
        </Route>
      </Route>

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
