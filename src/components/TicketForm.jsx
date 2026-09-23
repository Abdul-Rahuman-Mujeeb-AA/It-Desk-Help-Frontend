import { useState } from "react";
import {
  FaPaperclip,
  FaSave,
  FaTimes,
  FaTicketAlt,
  FaTrash,
} from "react-icons/fa";

const getInitialState = (ticket) => ({
  title: ticket?.title || "",
  description: ticket?.description || "",
  category: ticket?.category || "Other",
  priority: ticket?.priority || "Medium",
  status: ticket?.status || "Pending",
  assignedTo: ticket?.assignedTo?._id || ticket?.assignedTo || "",
});

const TicketForm = ({
  ticket = null,
  users = [],
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState(() => getInitialState(ticket));

  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState("");

  const isEdit = Boolean(ticket?._id);

 const getUserRole = () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    return user?.role || "user";
  } catch {
    return "user";
  }
};

  const isAdmin = getUserRole() === "admin";

  //Handle input changes

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  //Handle attachment

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setAttachment(null);
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("File size must be less than 5 MB.");
      event.target.value = "";
      setAttachment(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, GIF, PDF, DOC and DOCX files are allowed.");

      event.target.value = "";
      setAttachment(null);
      return;
    }

    setError("");
    setAttachment(file);
  };

  /*
  |--------------------------------------------------------------------------
  | Remove newly selected attachment
  |--------------------------------------------------------------------------
  */
  const handleRemoveAttachment = (event) => {
    event.preventDefault();

    setAttachment(null);

    const input = document.getElementById("ticket-attachment");

    if (input) {
      input.value = "";
    }

    setError("");
  };

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const title = formData.title.trim();
    const description = formData.description.trim();

    if (!title) {
      setError("Ticket title is required.");
      return;
    }

    if (!description) {
      setError("Ticket description is required.");
      return;
    }

    if (title.length < 3) {
      setError("Ticket title must contain at least 3 characters.");
      return;
    }

    if (description.length < 5) {
      setError("Ticket description must contain at least 5 characters.");
      return;
    }

    try {
      const data = new FormData();

      data.append("title", title);
      data.append("description", description);
      data.append("category", formData.category || "Other");
      data.append("priority", formData.priority || "Medium");

      /*
       * Status is only sent while editing.
       * The backend create controller uses its default status.
       */
      if (isEdit && isAdmin) {
        data.append("status", formData.status || "Pending");
      }

      /*
       * Assignment is sent for admin.
       */
      if (isAdmin && formData.assignedTo) {
        data.append("assignedTo", formData.assignedTo);
      }

      /*
       * Attachment.
       */
      if (attachment) {
        data.append("attachment", attachment);
      }

      if (typeof onSubmit === "function") {
        await onSubmit(data);
      }
    } catch (submitError) {
      console.error("Ticket form submit error:", submitError);

      setError(
        submitError?.response?.data?.message ||
          submitError?.message ||
          "Failed to save ticket.",
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Existing attachment name
  |--------------------------------------------------------------------------
  */
  const existingAttachment = ticket?.attachment || "";

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3 border-b border-gray-200 pb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <FaTicketAlt />
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Update Ticket" : "Create New Ticket"}
          </h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            {isEdit
              ? "Update the ticket information below."
              : "Enter the details of your support request."}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label
          htmlFor="ticket-title"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Ticket Title
        </label>

        <input
          id="ticket-title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter ticket title"
          maxLength={100}
          disabled={loading}
          autoComplete="off"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
        />

        <p className="mt-1 text-right text-xs text-gray-400">
          {formData.title.length}/100
        </p>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="ticket-description"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id="ticket-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your issue in detail..."
          rows={5}
          maxLength={1000}
          disabled={loading}
          className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
        />

        <p className="mt-1 text-right text-xs text-gray-400">
          {formData.description.length}/1000
        </p>
      </div>

      {/* Category + Priority */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Category */}
        <div>
          <label
            htmlFor="ticket-category"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Category
          </label>

          <select
            id="ticket-category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            <option value="Network">Network</option>

            <option value="Software">Software</option>

            <option value="Access Request">Access Request</option>

            <option value="System">System</option>

            <option value="Other">Other</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label
            htmlFor="ticket-priority"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Priority
          </label>

          <select
            id="ticket-priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* Admin controls */}
      {isAdmin && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Status */}
          {isEdit && (
            <div>
              <label
                htmlFor="ticket-status"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Status
              </label>

              <select
                id="ticket-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                <option value="Pending">Pending</option>

                <option value="In Progress">In Progress</option>

                <option value="Completed">Completed</option>
              </select>
            </div>
          )}

          {/* Assigned User */}
          <div className={isEdit ? "" : "sm:col-span-2"}>
            <label
              htmlFor="ticket-assignedTo"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Assign To
            </label>

            <select
              id="ticket-assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <option value="">Unassigned</option>

              {users
                .filter((item) => item?.role !== "admin")
                .map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name || item.email}
                  </option>
                ))}
            </select>
          </div>
        </div>
      )}

      {/* Attachment */}
      <div>
        <label
          htmlFor="ticket-attachment"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Attachment
        </label>

        <div className="relative">
          <label
            htmlFor="ticket-attachment"
            className="flex min-h-28 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-center transition hover:border-blue-400 hover:bg-gray-100"
          >
            <FaPaperclip className="mb-2 text-lg text-gray-400" />

            {attachment ? (
              <>
                <span className="max-w-full break-all text-sm font-medium text-blue-600">
                  {attachment.name}
                </span>

                <span className="mt-1 text-xs text-gray-400">
                  {(attachment.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </>
            ) : (
              <>
                <span className="text-sm font-medium text-gray-600">
                  Click to upload a file
                </span>

                <span className="mt-1 text-xs text-gray-400">
                  JPG, PNG, GIF, PDF, DOC, DOCX
                  <br />
                  Maximum size: 5 MB
                </span>
              </>
            )}

            <input
              id="ticket-attachment"
              name="attachment"
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
              onChange={handleFileChange}
              disabled={loading}
              className="hidden"
            />
          </label>

          {attachment && (
            <button
              type="button"
              onClick={handleRemoveAttachment}
              disabled={loading}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 transition hover:bg-red-200 disabled:opacity-50"
              title="Remove selected attachment"
            >
              <FaTrash size={12} />
            </button>
          )}
        </div>

        {/* Existing attachment */}
        {isEdit && existingAttachment && !attachment && (
          <div className="mt-2 flex flex-col gap-1 rounded-lg bg-gray-50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-w-0 text-xs text-gray-500">
              Existing attachment:
            </p>

            <p className="break-all text-xs font-medium text-gray-700">
              {existingAttachment}
            </p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <FaTimes />
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <FaSave />

          {loading ? "Saving..." : isEdit ? "Update Ticket" : "Create Ticket"}
        </button>
      </div>
    </form>
  );
};

export default TicketForm;
