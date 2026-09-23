import api from "./api";

export const getUserProfile = async () => {
  const response = await api.get("/users/profile");

  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put("/users/profile", profileData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put(
    "/users/change-password",
    passwordData
  );

  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.delete("/users/profile");

  return response.data;
};

export default {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteAccount,
};