
const DashboardCard = ({
  title,
  value = 0,
  icon: Icon,
  description = "",
  iconBg = "bg-blue-100",
  iconColor = "text-blue-600",
}) => {
  return (
    <div
      className="
        w-full
        p-4 sm:p-5
        bg-white
        border border-gray-200
        rounded-xl
        shadow-sm
        transition
        hover:shadow-md
      "
    >
      <div className="flex items-center justify-between gap-3">
        {/* Text */}
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 sm:text-sm">
            {title}
          </p>

          <h3 className="mt-1 text-2xl font-bold text-gray-800 sm:text-3xl">
            {value}
          </h3>

          {description && (
            <p className="mt-1 text-xs text-gray-400 truncate">
              {description}
            </p>
          )}
        </div>

        {/* Icon */}
        {Icon && (
          <div
            className={`
              shrink-0
              flex items-center justify-center
              w-11 h-11
              sm:w-12 sm:h-12
              rounded-xl
              ${iconBg}
              ${iconColor}
            `}
          >
            <Icon size={20} className="sm:hidden" />
            <Icon size={23} className="hidden sm:block" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;