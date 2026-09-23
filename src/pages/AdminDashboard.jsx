import { useEffect, useState } from "react";
import {
  FaUsers,
  FaUserShield,
  FaUser,
  FaTicketAlt,
  FaCheckCircle,
  FaClock,
  FaHourglassHalf,
  FaExclamationTriangle,
  FaChartPie,
  FaChartBar,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-hot-toast";

import DashboardCard from "../components/DashboardCard";
import Loader from "../components/Loader";

import { getAllUsers } from "../services/adminService";
import { getAllTickets } from "../services/ticketService";

const BACKEND_URL = "https://it-desk-help-backend.onrender.com";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to load dashboard data
  const loadDashboard = async () => {
    try {
      const [usersResponse, ticketsResponse] = await Promise.all([
        getAllUsers(),
        getAllTickets(),
      ]);

      const usersData =
        usersResponse?.data?.data?.users ||
        usersResponse?.data?.users ||
        usersResponse?.data?.data ||
        usersResponse?.data ||
        [];

      const ticketsData =
        ticketsResponse?.data?.data?.tickets ||
        ticketsResponse?.data?.tickets ||
        ticketsResponse?.data?.data ||
        ticketsResponse?.data ||
        [];

      setUsers(Array.isArray(usersData) ? usersData : []);
      setTickets(Array.isArray(ticketsData) ? ticketsData : []);
    } catch (error) {
      console.error("Admin dashboard error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to load dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDashboard();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const totalUsers = users.length;

  const totalAdmins = users.filter((user) => user.role === "admin").length;

  const totalRegularUsers = users.filter((user) => user.role === "user").length;

  const totalTickets = tickets.length;

  const completedTickets = tickets.filter(
    (ticket) => ticket.status === "Completed",
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress",
  ).length;

  const pendingTickets = tickets.filter(
    (ticket) => ticket.status === "Pending",
  ).length;

  const highPriorityTickets = tickets.filter(
    (ticket) => ticket.priority === "High",
  ).length;

  const mediumPriorityTickets = tickets.filter(
    (ticket) => ticket.priority === "Medium",
  ).length;

  const lowPriorityTickets = tickets.filter(
    (ticket) => ticket.priority === "Low",
  ).length;

  const statusData = [
    {
      name: "Pending",
      value: pendingTickets,
    },
    {
      name: "In Progress",
      value: inProgressTickets,
    },
    {
      name: "Completed",
      value: completedTickets,
    },
  ];

  const priorityData = [
    {
      name: "High",
      value: highPriorityTickets,
    },
    {
      name: "Medium",
      value: mediumPriorityTickets,
    },
    {
      name: "Low",
      value: lowPriorityTickets,
    },
  ];

  const roleData = [
    {
      name: "Users",
      value: totalRegularUsers,
    },
    {
      name: "Admins",
      value: totalAdmins,
    },
  ];

  const recentUsers = [...users]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    )
    .slice(0, 5);

  const recentTickets = [...tickets]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    )
    .slice(0, 5);

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getProfileImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${BACKEND_URL}/uploads/${image}`;
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "In Progress":
        return "bg-blue-100 text-blue-700";

      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getPriorityClasses = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";

      case "Low":
        return "bg-green-100 text-green-700";

      case "Medium":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return <Loader text="Loading admin dashboard..." />;
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6">
      {/* Header */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500 sm:text-base">
          Monitor users, tickets, priorities, and system activity.
        </p>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Total Users"
          value={totalUsers}
          description="Registered users"
          icon={FaUsers}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <DashboardCard
          title="Administrators"
          value={totalAdmins}
          description="Admin accounts"
          icon={FaUserShield}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />

        <DashboardCard
          title="Regular Users"
          value={totalRegularUsers}
          description="User accounts"
          icon={FaUser}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />

        <DashboardCard
          title="Total Tickets"
          value={totalTickets}
          description="All support tickets"
          icon={FaTicketAlt}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* Ticket Statistics */}
      <div className="grid grid-cols-1 gap-4 mt-5 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Pending"
          value={pendingTickets}
          description="Awaiting action"
          icon={FaHourglassHalf}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />

        <DashboardCard
          title="In Progress"
          value={inProgressTickets}
          description="Currently being handled"
          icon={FaClock}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <DashboardCard
          title="Completed"
          value={completedTickets}
          description="Resolved tickets"
          icon={FaCheckCircle}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />

        <DashboardCard
          title="High Priority"
          value={highPriorityTickets}
          description="Requires attention"
          icon={FaExclamationTriangle}
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 mt-5 xl:grid-cols-3">
        {/* Status Chart */}
        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl sm:p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 text-blue-600 bg-blue-100 rounded-lg shrink-0">
              <FaChartPie />
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold text-gray-800">Ticket Status</h2>

              <p className="text-xs text-gray-400">
                Current ticket distribution
              </p>
            </div>
          </div>

          <div className="w-full h-60 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`status-${entry.name}-${index}`} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            {statusData.map((item) => (
              <div key={item.name} className="text-center">
                <p className="text-xs text-gray-400">{item.name}</p>

                <p className="mt-1 text-lg font-bold text-gray-700">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Chart */}
        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl sm:p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 text-orange-600 bg-orange-100 rounded-lg shrink-0">
              <FaChartBar />
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold text-gray-800">Ticket Priority</h2>

              <p className="text-xs text-gray-400">Priority distribution</p>
            </div>
          </div>

          <div className="w-full h-60 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priorityData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -15,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" tick={{ fontSize: 12 }} />

                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />

                <Tooltip />

                <Bar dataKey="value" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            {priorityData.map((item) => (
              <div key={item.name} className="text-center">
                <p className="text-xs text-gray-400">{item.name}</p>

                <p className="mt-1 text-lg font-bold text-gray-700">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* User Role Chart */}
        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl sm:p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 text-purple-600 bg-purple-100 rounded-lg shrink-0">
              <FaUsers />
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold text-gray-800">User Roles</h2>

              <p className="text-xs text-gray-400">Account role distribution</p>
            </div>
          </div>

          <div className="w-full h-60 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={roleData}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 12 }}
                  width={55}
                />

                <Tooltip />

                <Bar dataKey="value" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="p-3 text-center bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-400">Users</p>

              <p className="mt-1 text-xl font-bold text-gray-700">
                {totalRegularUsers}
              </p>
            </div>

            <div className="p-3 text-center bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-400">Admins</p>

              <p className="mt-1 text-xl font-bold text-gray-700">
                {totalAdmins}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-5 mt-5 xl:grid-cols-2">
        {/* Recent Tickets */}
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-100 sm:p-5 lg:p-6">
            <div className="min-w-0">
              <h2 className="font-semibold text-gray-800">Recent Tickets</h2>

              <p className="mt-1 text-xs text-gray-400">
                Latest support requests
              </p>
            </div>

            <FaTicketAlt className="text-blue-500 shrink-0" />
          </div>

          {recentTickets.length === 0 ? (
            <div className="px-5 py-10 text-sm text-center text-gray-400">
              No tickets available.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentTickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="p-4 transition hover:bg-gray-50 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-gray-700 wrap-break-words">
                        {ticket.title || "Untitled Ticket"}
                      </h3>

                      <p className="mt-1 text-xs text-gray-400 break-all">
                        #{ticket._id}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 px-2.5 py-1 text-xs font-medium rounded-full ${getStatusClasses(
                        ticket.status,
                      )}`}
                    >
                      {ticket.status || "Pending"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-gray-400">
                    <span>{ticket.category || "Other"}</span>

                    <span
                      className={`px-2 py-0.5 rounded-full ${getPriorityClasses(
                        ticket.priority,
                      )}`}
                    >
                      {ticket.priority || "Medium"}
                    </span>

                    <span>{formatDate(ticket.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-100 sm:p-5 lg:p-6">
            <div className="min-w-0">
              <h2 className="font-semibold text-gray-800">Recent Users</h2>

              <p className="mt-1 text-xs text-gray-400">
                Recently registered accounts
              </p>
            </div>

            <FaUsers className="text-purple-500 shrink-0" />
          </div>

          {recentUsers.length === 0 ? (
            <div className="px-5 py-10 text-sm text-center text-gray-400">
              No users available.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 p-4 transition hover:bg-gray-50 sm:p-5"
                >
                  <div className="flex items-center justify-center shrink-0 w-10 h-10 overflow-hidden text-blue-600 bg-blue-100 rounded-full">
                    {user.profileImage ? (
                      <img
                        src={getProfileImageUrl(user.profileImage)}
                        alt={user.name || "User"}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <FaUser />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-700 truncate">
                      {user.name || "Unknown User"}
                    </h3>

                    <p className="mt-0.5 text-xs text-gray-400 truncate">
                      {user.email || "No email"}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role === "admin" ? "Admin" : "User"}
                    </span>

                    <p className="mt-1 text-[11px] text-gray-400">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 mt-5 bg-white border border-gray-200 shadow-sm rounded-xl sm:p-5 lg:p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <p className="text-xs text-gray-400">Total Tickets</p>

            <p className="mt-1 text-xl font-bold text-gray-800 sm:text-2xl">
              {totalTickets}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-400">Pending</p>

            <p className="mt-1 text-xl font-bold text-yellow-600 sm:text-2xl">
              {pendingTickets}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-400">In Progress</p>

            <p className="mt-1 text-xl font-bold text-blue-600 sm:text-2xl">
              {inProgressTickets}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-400">Completed</p>

            <p className="mt-1 text-xl font-bold text-green-600 sm:text-2xl">
              {completedTickets}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
