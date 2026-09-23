import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaHome,
  FaLifeRing,
  FaTicketAlt,
} from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Top Section */}
          <div className="px-5 py-10 text-center sm:px-8 sm:py-14 lg:px-12 lg:py-16">
            {/* Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 sm:h-24 sm:w-24">
              <FaTicketAlt className="text-3xl sm:text-4xl" />
            </div>

            {/* Error Code */}
            <p className="mt-6 text-6xl font-extrabold tracking-tight text-blue-600 sm:text-7xl lg:text-8xl">
              404
            </p>

            {/* Title */}
            <h1 className="mt-4 text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl">
              Page Not Found
            </h1>

            {/* Description */}
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500 sm:text-base sm:leading-7">
              The page you are looking for does not exist, has been moved,
              or may no longer be available.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={handleGoBack}
                className="
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-gray-50
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:ring-offset-2
                  sm:w-auto
                "
              >
                <FaArrowLeft className="text-xs" />
                Go Back
              </button>

              <Link
                to="/login"
                className="
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-blue-600
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-blue-700
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:ring-offset-2
                  sm:w-auto
                "
              >
                <FaHome className="text-xs" />
                Go to Login
              </Link>
            </div>
          </div>

          {/* Help Section */}
          <div className="border-t border-gray-200 bg-gray-50 px-5 py-6 sm:px-8">
            <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center sm:text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <FaLifeRing />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">
                  IT Help Desk Portal
                </p>

                <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                  Return to the portal and continue managing your tickets.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-xs text-gray-400 sm:text-sm">
          IT Help Desk Portal
        </p>
      </div>
    </main>
  );
};

export default NotFound;