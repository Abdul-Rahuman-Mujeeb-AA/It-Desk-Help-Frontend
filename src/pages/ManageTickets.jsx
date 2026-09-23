import { useEffect, useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaTicketAlt,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Loader from "../components/Loader";
import Modal from "../components/Modal";
import TicketForm from "../components/TicketForm";
import TicketStatus from "../components/TicketStatus";

import {
  getAllTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../services/ticketService";

import { getAllUsers } from "../services/adminService";

const ManageTickets = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] =
    useState(false);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedTicket, setSelectedTicket] =
    useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [priorityFilter, setPriorityFilter] =
    useState("All");
  const [categoryFilter, setCategoryFilter] =
    useState("All");

  /*
   * Load tickets and users
   */
  const loadData = async () => {
    try {
      setLoading(true);

      const [ticketsResponse, usersResponse] =
        await Promise.all([
          getAllTickets(),
          getAllUsers(),
        ]);

      const ticketsData =
        ticketsResponse?.data?.data?.tickets ||
        ticketsResponse?.data?.tickets ||
        ticketsResponse?.data?.data ||
        ticketsResponse?.data ||
        [];

      const usersData =
        usersResponse?.data?.data?.users ||
        usersResponse?.data?.users ||
        usersResponse?.data?.data ||
        usersResponse?.data ||
        [];

      setTickets(
        Array.isArray(ticketsData)
          ? ticketsData
          : []
      );

      setUsers(
        Array.isArray(usersData)
          ? usersData
          : []
      );
    } catch (error) {
      console.error(
        "Manage tickets error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load tickets."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Initial load
   */
  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      if (cancelled) return;

      await loadData();
    };

    const timer = setTimeout(() => {
      initialize();
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  /*
   * Open create modal
   */
  const handleCreate = () => {
    setSelectedTicket(null);
    setIsModalOpen(true);
  };

  /*
   * Open edit modal
   */
  const handleEdit = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  /*
   * View ticket
   */
  const handleView = (ticketId) => {
    navigate(`/tickets/${ticketId}`);
  };

  /*
   * Close modal
   */
  const handleCloseModal = () => {
    if (submitLoading) return;

    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  /*
   * Create / update ticket
   */
  const handleSubmit = async (formData) => {
    try {
      setSubmitLoading(true);

      if (selectedTicket?._id) {
        const response = await updateTicket(
          selectedTicket._id,
          formData
        );

        const updatedTicket =
          response?.data?.data?.ticket ||
          response?.data?.data ||
          response?.data?.ticket ||
          response?.data;

        if (updatedTicket) {
          setTickets((previous) =>
            previous.map((ticket) =>
              ticket._id === selectedTicket._id
                ? updatedTicket
                : ticket
            )
          );
        } else {
          await loadData();
        }

        toast.success(
          "Ticket updated successfully."
        );
      } else {
        const response =
          await createTicket(formData);

        const newTicket =
          response?.data?.data?.ticket ||
          response?.data?.data ||
          response?.data?.ticket ||
          response?.data;

        if (newTicket) {
          setTickets((previous) => [
            newTicket,
            ...previous,
          ]);
        } else {
          await loadData();
        }

        toast.success(
          "Ticket created successfully."
        );
      }

      setIsModalOpen(false);
      setSelectedTicket(null);
    } catch (error) {
      console.error(
        "Save ticket error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to save ticket."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  /*
   * Delete ticket
   */
  const handleDelete = async (ticketId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await deleteTicket(ticketId);

      setTickets((previous) =>
        previous.filter(
          (ticket) => ticket._id !== ticketId
        )
      );

      toast.success(
        "Ticket deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete ticket error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete ticket."
      );
    }
  };

  /*
   * Clear filters
   */
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setCategoryFilter("All");
  };

  /*
   * Filter tickets
   */
  const filteredTickets = tickets.filter(
    (ticket) => {
      const searchValue =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        ticket.title
          ?.toLowerCase()
          .includes(searchValue) ||
        ticket.description
          ?.toLowerCase()
          .includes(searchValue) ||
        ticket._id
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        ticket.priority === priorityFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        ticket.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCategory
      );
    }
  );

  /*
   * Date formatter
   */
  const formatDate = (date) => {
    if (!date) return "N/A";

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

  /*
   * Priority styles
   */
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

  /*
   * User name
   */
  const getUserName = (user) => {
    if (!user) {
      return "Not assigned";
    }

    if (typeof user === "string") {
      const foundUser = users.find(
        (item) => item._id === user
      );

      return (
        foundUser?.name ||
        foundUser?.email ||
        "Unknown User"
      );
    }

    return (
      user.name ||
      user.email ||
      "Unknown User"
    );
  };

  /*
   * Loading
   */
  if (loading) {
    return (
      <Loader text="Loading tickets..." />
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Manage Tickets
          </h1>

          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Create, view, update, and manage all
            support tickets.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="
            inline-flex
            items-center
            justify-center
            w-full
            gap-2
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            bg-blue-600
            rounded-lg
            hover:bg-blue-700
            transition
            sm:w-auto
          "
        >
          <FaPlus />
          Create Ticket
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-4">
        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">
                Total
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {tickets.length}
              </p>
            </div>

            <div className="flex items-center justify-center w-10 h-10 text-blue-600 bg-blue-100 rounded-lg">
              <FaTicketAlt />
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">
                Pending
              </p>

              <p className="mt-1 text-2xl font-bold text-yellow-600">
                {
                  tickets.filter(
                    (ticket) =>
                      ticket.status ===
                      "Pending"
                  ).length
                }
              </p>
            </div>

            <div className="flex items-center justify-center w-10 h-10 text-yellow-600 bg-yellow-100 rounded-lg">
              <FaTicketAlt />
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">
                In Progress
              </p>

              <p className="mt-1 text-2xl font-bold text-blue-600">
                {
                  tickets.filter(
                    (ticket) =>
                      ticket.status ===
                      "In Progress"
                  ).length
                }
              </p>
            </div>

            <div className="flex items-center justify-center w-10 h-10 text-blue-600 bg-blue-100 rounded-lg">
              <FaTicketAlt />
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">
                Completed
              </p>

              <p className="mt-1 text-2xl font-bold text-green-600">
                {
                  tickets.filter(
                    (ticket) =>
                      ticket.status ===
                      "Completed"
                  ).length
                }
              </p>
            </div>

            <div className="flex items-center justify-center w-10 h-10 text-green-600 bg-green-100 rounded-lg">
              <FaTicketAlt />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-blue-600" />

          <h2 className="text-sm font-semibold text-gray-700">
            Search & Filters
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <FaSearch
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
              size={14}
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search tickets..."
              className="
                w-full
                py-3
                pl-11
                pr-4
                text-sm
                border
                border-gray-300
                rounded-lg
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="
              w-full
              px-3
              py-3
              text-sm
              text-gray-700
              bg-white
              border
              border-gray-300
              rounded-lg
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          >
            <option value="All">
              All Statuses
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>

          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(
                event.target.value
              )
            }
            className="
              w-full
              px-3
              py-3
              text-sm
              text-gray-700
              bg-white
              border
              border-gray-300
              rounded-lg
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          >
            <option value="All">
              All Priorities
            </option>

            <option value="High">
              High
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="Low">
              Low
            </option>
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(
                event.target.value
              )
            }
            className="
              w-full
              px-3
              py-3
              text-sm
              text-gray-700
              bg-white
              border
              border-gray-300
              rounded-lg
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          >
            <option value="All">
              All Categories
            </option>

            <option value="Network">
              Network
            </option>

            <option value="Software">
              Software
            </option>

            <option value="Access Request">
              Access Request
            </option>

            <option value="System">
              System
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>

        {(search ||
          statusFilter !== "All" ||
          priorityFilter !== "All" ||
          categoryFilter !== "All") && (
          <button
            type="button"
            onClick={clearFilters}
            className="
              inline-flex
              items-center
              gap-2
              mt-4
              text-sm
              font-medium
              text-red-600
              hover:text-red-700
            "
          >
            <FaTimes />
            Clear Filters
          </button>
        )}
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700">
            {filteredTickets.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700">
            {tickets.length}
          </span>{" "}
          tickets
        </p>
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl md:block">
        {filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <FaTicketAlt className="mb-4 text-5xl text-gray-300" />

            <h3 className="text-lg font-semibold text-gray-700">
              No tickets found
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-225">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-4 text-xs font-semibold tracking-wide text-left text-gray-500 uppercase">
                    Ticket
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold tracking-wide text-left text-gray-500 uppercase">
                    Category
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold tracking-wide text-left text-gray-500 uppercase">
                    Priority
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold tracking-wide text-left text-gray-500 uppercase">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold tracking-wide text-left text-gray-500 uppercase">
                    Assigned To
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold tracking-wide text-left text-gray-500 uppercase">
                    Created
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold tracking-wide text-right text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredTickets.map(
                  (ticket) => (
                    <tr
                      key={ticket._id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <div className="max-w-60">
                          <p className="font-semibold text-gray-700 wrap-break-words">
                            {ticket.title ||
                              "Untitled Ticket"}
                          </p>

                          <p className="mt-1 font-mono text-xs text-gray-400 truncate">
                            #{ticket._id}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {ticket.category ||
                          "Other"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`
                            inline-flex
                            px-2.5
                            py-1
                            text-xs
                            font-semibold
                            rounded-full
                            ${getPriorityClasses(
                              ticket.priority
                            )}
                          `}
                        >
                          {ticket.priority ||
                            "Medium"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <TicketStatus
                          status={
                            ticket.status ||
                            "Pending"
                          }
                          showLabel
                        />
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        <span className="block max-w-37.5 truncate">
                          {getUserName(
                            ticket.assignedTo
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(
                          ticket.createdAt
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleView(
                                ticket._id
                              )
                            }
                            title="View Ticket"
                            className="
                              flex
                              items-center
                              justify-center
                              w-9
                              h-9
                              text-blue-600
                              bg-blue-50
                              rounded-lg
                              hover:bg-blue-100
                            "
                          >
                            <FaEye size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(ticket)
                            }
                            title="Edit Ticket"
                            className="
                              flex
                              items-center
                              justify-center
                              w-9
                              h-9
                              text-green-600
                              bg-green-50
                              rounded-lg
                              hover:bg-green-100
                            "
                          >
                            <FaEdit size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                ticket._id
                              )
                            }
                            title="Delete Ticket"
                            className="
                              flex
                              items-center
                              justify-center
                              w-9
                              h-9
                              text-red-600
                              bg-red-50
                              rounded-lg
                              hover:bg-red-100
                            "
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
            <FaTicketAlt className="mb-4 text-5xl text-gray-300" />

            <h3 className="text-lg font-semibold text-gray-700">
              No tickets found
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket._id}
              className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-800 wrap-break-words">
                    {ticket.title ||
                      "Untitled Ticket"}
                  </h3>

                  <p className="mt-1 font-mono text-xs text-gray-400 break-all">
                    #{ticket._id}
                  </p>
                </div>

                <TicketStatus
                  status={
                    ticket.status || "Pending"
                  }
                  showLabel
                />
              </div>

              {/* Description */}
              <p className="mt-4 text-sm leading-6 text-gray-500 line-clamp-2">
                {ticket.description ||
                  "No description provided."}
              </p>

              {/* Information */}
              <div className="grid grid-cols-2 gap-3 pt-4 mt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">
                    Category
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {ticket.category ||
                      "Other"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Priority
                  </p>

                  <span
                    className={`
                      inline-flex
                      mt-1
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      rounded-full
                      ${getPriorityClasses(
                        ticket.priority
                      )}
                    `}
                  >
                    {ticket.priority ||
                      "Medium"}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Assigned To
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700 truncate">
                    {getUserName(
                      ticket.assignedTo
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Created
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {formatDate(
                      ticket.createdAt
                    )}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() =>
                    handleView(ticket._id)
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    px-3
                    py-2.5
                    text-xs
                    font-semibold
                    text-blue-700
                    bg-blue-50
                    rounded-lg
                    hover:bg-blue-100
                  "
                >
                  <FaEye />
                  View
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleEdit(ticket)
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    px-3
                    py-2.5
                    text-xs
                    font-semibold
                    text-green-700
                    bg-green-50
                    rounded-lg
                    hover:bg-green-100
                  "
                >
                  <FaEdit />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(ticket._id)
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    px-3
                    py-2.5
                    text-xs
                    font-semibold
                    text-red-700
                    bg-red-50
                    rounded-lg
                    hover:bg-red-100
                  "
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          selectedTicket
            ? "Edit Ticket"
            : "Create Ticket"
        }
        size="large"
      >
        <TicketForm
          key={
            selectedTicket?._id || "new-ticket"
          }
          ticket={selectedTicket}
          users={users}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          loading={submitLoading}
        />
      </Modal>
    </div>
  );
};

export default ManageTickets;