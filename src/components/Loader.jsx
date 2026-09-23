const Loader = ({ fullScreen = false, size = "medium", text = "Loading..." }) => {
  const sizes = {
    small: "w-5 h-5 border-2",
    medium: "w-8 h-8 border-4",
    large: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`
        flex flex-col items-center justify-center
        ${fullScreen ? "min-h-screen w-full" : "w-full py-10"}
      `}
    >
      {/* Spinner */}
      <div
        className={`
          ${sizes[size] || sizes.medium}
          border-gray-200
          border-t-blue-600
          rounded-full
          animate-spin
        `}
      />

      {/* Loading Text */}
      {text && (
        <p className="mt-3 text-sm font-medium text-gray-500">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;