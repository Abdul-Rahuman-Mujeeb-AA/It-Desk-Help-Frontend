import { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaPlus,
  FaTicketAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

import DashboardCard from "../components/DashboardCard";
import TicketCard from "../components/TicketCard";
import TicketForm from "../components/TicketForm";
import Modal from "../components/Modal";
import Loader from "../components/Loader";

import {
  getMyTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../services/ticketService";

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  /*
   * Load tickets
   */
  const loadTickets = async () => {
    try {
      setLoading(true);

      const response = await getMyTickets();

      const responseData = response?.data?.data ?? response?.data;

      let ticketList = [];

      if (Array.isArray(responseData)) {
        ticketList = responseData;
      } else if (Array.isArray(responseData?.tickets)) {
        ticketList = responseData.tickets;
      }

      setTickets(ticketList);
    } catch (error) {
      console.error("Load tickets error:", error);

      toast.error(error?.response?.data?.message || "Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * Initial ticket loading
   *
   * The async callback prevents the initial state update
   * from happening synchronously inside useEffect.
   */
  useEffect(() => {
    let mounted = true;

    const initializeDashboard = async () => {
      if (!mounted) return;

      await Promise.resolve();

      if (!mounted) return;

      loadTickets();
    };

    initializeDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Open create modal
   */
  const handleOpenCreate = () => {
    setSelectedTicket(null);
    setIsModalOpen(true);
  };

  /*
   * Open edit modal
   */
  const handleOpenEdit = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
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
   * Create / Update ticket
   */
  const handleSubmit = async (formData) => {
    try {
      setSubmitLoading(true);

      if (selectedTicket) {
        await updateTicket(selectedTicket._id, formData);

        toast.success("Ticket updated successfully.");
      } else {
        await createTicket(formData);

        toast.success("Ticket created successfully.");
      }

      setIsModalOpen(false);
      setSelectedTicket(null);

      await loadTickets();
    } catch (error) {
      console.error("Save ticket error:", error);

      toast.error(error?.response?.data?.message || "Failed to save ticket.");
    } finally {
      setSubmitLoading(false);
    }
  };

  /*
   * Delete ticket
   */
  const handleDelete = async (ticketId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?",
    );

    if (!confirmed) return;

    try {
      await deleteTicket(ticketId);

      setTickets((previousTickets) =>
        previousTickets.filter((ticket) => ticket._id !== ticketId),
      );

      toast.success("Ticket deleted successfully.");
    } catch (error) {
      console.error("Delete ticket error:", error);

      toast.error(error?.response?.data?.message || "Failed to delete ticket.");
    }
  };

  /*
   * Ticket statistics
   */
  const totalTickets = tickets.length;

  const pendingTickets = tickets.filter(
    (ticket) => ticket.status === "Pending",
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress",
  ).length;

  const completedTickets = tickets.filter(
    (ticket) => ticket.status === "Completed",
  ).length;

  /*
   * Loading
   */
  if (loading) {
    return <Loader text="Loading your tickets..." size="medium" />;
  }

  return (
    <div className="w-full">
      {/* =========================
          PAGE HEADER
      ========================== */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            My Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Manage and track your IT support tickets.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="
            inline-flex
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
            transition
            sm:w-auto
          "
        >
          <FaPlus />
          Create Ticket
        </button>
      </div>

      {/* =========================
          STATISTICS
      ========================== */}
      <div
        className="
          grid
          grid-cols-1
          gap-4
          mb-8
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <DashboardCard
          title="Total Tickets"
          value={totalTickets}
          description="All your tickets"
          icon={FaClipboardList}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <DashboardCard
          title="Pending"
          value={pendingTickets}
          description="Waiting for support"
          icon={FaClock}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />

        <DashboardCard
          title="In Progress"
          value={inProgressTickets}
          description="Currently being handled"
          icon={FaTicketAlt}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />

        <DashboardCard
          title="Completed"
          value={completedTickets}
          description="Successfully resolved"
          icon={FaCheckCircle}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
      </div>

      {/* =========================
          TICKETS HEADER
      ========================== */}
      <div className="mb-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">My Tickets</h2>

            <p className="mt-1 text-sm text-gray-500">
              View and manage your support requests.
            </p>
          </div>

          {tickets.length > 0 && (
            <span className="self-start px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
              {tickets.length} {tickets.length === 1 ? "Ticket" : "Tickets"}
            </span>
          )}
        </div>
      </div>

      {/* =========================
          EMPTY STATE
      ========================== */}
      {tickets.length === 0 ? (
        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            px-5
            py-12
            text-center
            bg-white
            border
            border-gray-200
            rounded-xl
            shadow-sm
          "
        >
          <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
            <FaClipboardList className="text-2xl text-blue-600" />
          </div>

          <h3 className="text-lg font-semibold text-gray-800">
            No tickets found
          </h3>

          <p className="max-w-md mt-2 text-sm text-gray-500">
            You haven't created any support tickets yet. Create a ticket when
            you need help from the IT team.
          </p>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="
              inline-flex
              items-center
              gap-2
              px-5
              py-2.5
              mt-5
              text-sm
              font-semibold
              text-white
              bg-blue-600
              rounded-lg
              hover:bg-blue-700
              transition
            "
          >
            <FaPlus />
            Create Your First Ticket
          </button>
        </div>
      ) : (
        /* =========================
          TICKET GRID
        ========================== */
        <div
          className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {tickets.map((ticket) => (
            <div key={ticket._id} className="flex flex-col">
              <TicketCard
                ticket={ticket}
                onView={() => handleOpenEdit(ticket)}
              />

              <div className="flex gap-2 mt-2">
                {/* Edit */}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(ticket)}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    flex-1
                    gap-2
                    px-3
                    py-2
                    text-xs
                    font-medium
                    text-blue-600
                    bg-blue-50
                    rounded-lg
                    hover:bg-blue-100
                    transition
                  "
                >
                  <FaEdit />
                  Edit
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDelete(ticket._id)}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    flex-1
                    gap-2
                    px-3
                    py-2
                    text-xs
                    font-medium
                    text-red-600
                    bg-red-50
                    rounded-lg
                    hover:bg-red-100
                    transition
                  "
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================
          CREATE / EDIT MODAL
      ========================== */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedTicket ? "Edit Support Ticket" : "Create Support Ticket"}
        size="large"
      >
        <TicketForm
          key={selectedTicket?._id || "new-ticket"}
          ticket={selectedTicket}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          loading={submitLoading}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
