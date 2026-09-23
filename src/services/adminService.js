import api from "./api";

export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");

  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/admin/users");

  return response.data;
};

export const getUserById = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const response = await api.get(`/admin/users/${userId}`);

  return response.data;
};

export const updateUser = async (userId, userData) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const response = await api.put(
    `/admin/users/${userId}`,
    userData
  );

  return response.data;
};

export const deleteUser = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const response = await api.delete(`/admin/users/${userId}`);

  return response.data;
};

export const getRecentUsers = async () => {
  const response = await api.get("/admin/users/recent");

  return response.data;
};

export const getRecentTickets = async () => {
  const response = await api.get("/admin/tickets/recent");

  return response.data;
};

export default {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getRecentUsers,
  getRecentTickets,
};