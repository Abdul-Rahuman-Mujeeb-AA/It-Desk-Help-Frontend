import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const modalSizes = {
    small: "max-w-md",
    medium: "max-w-2xl",
    large: "max-w-4xl",
    full: "max-w-6xl",
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`
          relative w-full
          ${modalSizes[size] || modalSizes.medium}
          max-h-[90vh]
          overflow-hidden
          bg-white
          rounded-xl
          shadow-2xl
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 sm:px-6">
          <h2
            id="modal-title"
            className="pr-4 text-lg font-semibold text-gray-800 sm:text-xl"
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="
              shrink-0
              flex items-center justify-center
              w-9 h-9
              text-gray-500
              rounded-lg
              hover:bg-gray-100
              hover:text-gray-700
              transition-colors
            "
            aria-label="Close modal"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 py-4 overflow-y-auto sm:px-6 sm:py-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;