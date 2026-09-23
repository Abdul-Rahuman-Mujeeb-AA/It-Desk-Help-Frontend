import {
  FaCalendarAlt,
  FaClock,
  FaEye,
  FaPaperclip,
  FaUser,
} from "react-icons/fa";

const TicketCard = ({ ticket, onView }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "In Progress":
        return "bg-yellow-100 text-yellow-700";

      case "Pending":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";

      case "Medium":
        return "bg-orange-100 text-orange-700";

      case "Low":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full p-4 transition bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md sm:p-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-800 wrap-break-words sm:text-lg">
            {ticket?.title || "Untitled Ticket"}
          </h3>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Ticket ID: {ticket?._id || "N/A"}
          </p>
        </div>

        {/* Status */}
        <span
          className={`
            self-start
            px-3 py-1
            text-xs font-medium
            rounded-full
            whitespace-nowrap
            ${getStatusStyle(ticket?.status)}
          `}
        >
          {ticket?.status || "Pending"}
        </span>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm leading-6 text-gray-600 line-clamp-2">
        {ticket?.description || "No description available."}
      </p>

      {/* Ticket Information */}
      <div className="grid grid-cols-1 gap-3 mt-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
        {/* Category */}
        <div className="flex items-center gap-2 text-gray-600">
          <FaClock className="shrink-0 text-blue-500" />
          <span className="truncate">{ticket?.category || "Other"}</span>
        </div>

        {/* Priority */}
        <div className="flex items-center gap-2">
          <span
            className={`
              px-2.5 py-1
              text-xs font-medium
              rounded-full
              ${getPriorityStyle(ticket?.priority)}
            `}
          >
            {ticket?.priority || "Low"}
          </span>
        </div>

        {/* Created Date */}
        <div className="flex items-center gap-2 text-gray-600">
          <FaCalendarAlt className="shrink-0 text-blue-500" />
          <span>{formatDate(ticket?.createdAt)}</span>
        </div>

        {/* Assigned User */}
        <div className="flex items-center min-w-0 gap-2 text-gray-600">
          <FaUser className="shrink-0 text-blue-500" />

          <span className="truncate">
            {ticket?.assignedTo?.name || "Unassigned"}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 pt-4 mt-5 border-t border-gray-100 sm:flex-row sm:items-center sm:justify-between">
        {/* Attachment */}
        <div className="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
          {ticket?.attachment ? (
            <>
              <FaPaperclip className="text-gray-400" />
              <span>Attachment available</span>
            </>
          ) : (
            <span>No attachment</span>
          )}
        </div>

        {/* View Button */}
        <button
          type="button"
          onClick={() => onView?.(ticket)}
          className="
            flex items-center justify-center gap-2
            w-full
            px-4 py-2.5
            text-sm font-medium
            text-white
            bg-blue-600
            rounded-lg
            hover:bg-blue-700
            active:bg-blue-800
            transition-colors
            sm:w-auto
          "
        >
          <FaEye size={14} />
          View Ticket
        </button>
      </div>
    </div>
  );
};

export default TicketCard;
