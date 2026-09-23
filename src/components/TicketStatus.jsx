import { FaCheckCircle, FaClock, FaHourglassHalf } from "react-icons/fa";

const TicketStatus = ({ status = "Pending", showLabel = true }) => {
  const statusConfig = {
    Pending: {
      icon: FaHourglassHalf,
      style: "bg-gray-100 text-gray-700",
    },
    "In Progress": {
      icon: FaClock,
      style: "bg-yellow-100 text-yellow-700",
    },
    Completed: {
      icon: FaCheckCircle,
      style: "bg-green-100 text-green-700",
    },
  };

  const config = statusConfig[status] || statusConfig.Pending;
  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1.5
        text-xs font-medium
        rounded-full
        whitespace-nowrap
        ${config.style}
      `}
    >
      <Icon className="shrink-0" size={12} />

      {showLabel && <span>{status}</span>}
    </span>
  );
};

export default TicketStatus;
