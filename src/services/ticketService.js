import api from "./api";

export const createTicket = async (ticketData) => {
  const response = await api.post(
    "/tickets",
    ticketData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getMyTickets = async () => {
  const response = await api.get("/tickets/my");

  return response.data;
};

export const getAllTickets = async () => {
  const response = await api.get("/tickets");

  return response.data;
};

export const getTicketById = async (ticketId) => {
  if (!ticketId) {
    throw new Error("Ticket ID is required");
  }

  const response = await api.get(
    `/tickets/${ticketId}`
  );

  return response.data;
};


export const updateTicket = async (
  ticketId,
  ticketData
) => {
  if (!ticketId) {
    throw new Error("Ticket ID is required");
  }

  if (!ticketData) {
    throw new Error("Ticket data is required");
  }

  const response = await api.put(
    `/tickets/${ticketId}`,
    ticketData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


export const updateTicketStatus = async (
  ticketId,
  status
) => {
  if (!ticketId) {
    throw new Error("Ticket ID is required");
  }

  if (!status) {
    throw new Error("Ticket status is required");
  }

  const response = await api.patch(
    `/tickets/${ticketId}/status`,
    {
      status,
    }
  );

  return response.data;
};


export const assignTicket = async (
  ticketId,
  assignedTo
) => {
  if (!ticketId) {
    throw new Error("Ticket ID is required");
  }

  if (!assignedTo) {
    throw new Error("Assigned user is required");
  }

  const response = await api.patch(
    `/tickets/${ticketId}/assign`,
    {
      assignedTo,
    }
  );

  return response.data;
};

export const deleteTicket = async (ticketId) => {
  if (!ticketId) {
    throw new Error("Ticket ID is required");
  }

  const response = await api.delete(
    `/tickets/${ticketId}`
  );

  return response.data;
};

export default {
  createTicket,
  getMyTickets,
  getAllTickets,
  getTicketById,
  updateTicket,
  updateTicketStatus,
  assignTicket,
  deleteTicket,
};