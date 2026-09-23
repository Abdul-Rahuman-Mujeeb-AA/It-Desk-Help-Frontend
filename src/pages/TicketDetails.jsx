import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaFileAlt } from "react-icons/fa";
import toast from "react-hot-toast";

import { getTicketById } from "../services/ticketService";
import Loader from "../components/Loader";
import TicketStatus from "../components/TicketStatus";

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadTicket = async () => {
      try {
        setLoading(true);

        const response = await getTicketById(id);

        if (mounted) {
          setTicket(response?.data || null);
        }
      } catch (error) {
        if (mounted) {
          toast.error(
            error.response?.data?.message || "Failed to load ticket details",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadTicket();
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return <Loader fullScreen text="Loading ticket..." />;
  }

  if (!ticket) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Ticket not found
          </h2>

          <button
            onClick={() => navigate(-1)}
            className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const attachmentUrl = ticket.attachment
    ? `${API_BASE_URL}/uploads/${ticket.attachment}`
    : null;

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="mb-3 flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
          >
            <FaArrowLeft />
            Back
          </button>

          <h1 className="text-2xl font-bold text-gray-800">Ticket Details</h1>
        </div>

        <TicketStatus status={ticket.status} showLabel />
      </div>

      {/* Ticket Card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Title */}
        <div className="border-b border-gray-200 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Ticket ID: #{ticket._id}</p>

              <h2 className="mt-1 text-xl font-bold text-gray-800">
                {ticket.title}
              </h2>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${
                ticket.priority === "High"
                  ? "bg-red-100 text-red-700"
                  : ticket.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
              }`}
            >
              {ticket.priority} Priority
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="mt-1 font-medium text-gray-800">
              {ticket.category || "Other"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>
            <div className="mt-1">
              <TicketStatus status={ticket.status} showLabel />
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Created By</p>
            <p className="mt-1 font-medium text-gray-800">
              {ticket.createdBy?.name || "Unknown"}
            </p>

            {ticket.createdBy?.email && (
              <p className="text-sm text-gray-500">{ticket.createdBy.email}</p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">Assigned To</p>
            <p className="mt-1 font-medium text-gray-800">
              {ticket.assignedTo?.name || "Not assigned"}
            </p>

            {ticket.assignedTo?.email && (
              <p className="text-sm text-gray-500">{ticket.assignedTo.email}</p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="mt-1 font-medium text-gray-800">
              {ticket.createdAt
                ? new Date(ticket.createdAt).toLocaleString()
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Updated At</p>
            <p className="mt-1 font-medium text-gray-800">
              {ticket.updatedAt
                ? new Date(ticket.updatedAt).toLocaleString()
                : "-"}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="border-t border-gray-200 p-5 sm:p-6">
          <h3 className="mb-2 font-semibold text-gray-800">Description</h3>

          <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
            {ticket.description}
          </p>
        </div>

        {/* Attachment */}
        {attachmentUrl && (
          <div className="border-t border-gray-200 p-5 sm:p-6">
            <h3 className="mb-3 font-semibold text-gray-800">Attachment</h3>

            <a
              href={attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
            >
              <FaFileAlt />
              View Attachment
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetails;
