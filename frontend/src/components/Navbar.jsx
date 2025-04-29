import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth(); // Assuming useAuth provides isAuthenticated and logout functions.

  const handleLogout = () => {
    logout(); // Log out the user
    navigate("/"); // Redirect to the home page
  };

  return (
    <nav className="p-4 bg-white mx-auto max-w-6xl">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center space-x-2"
          onClick={() => navigate("/")} // Navigate directly to home
        >
          <span className="text-2xl font-bold text-gray-900">LOGO</span>
        </a>

        {/* Hamburger/Close Menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-gray-800 hover:text-gray-900 focus:outline-none transition-transform duration-300 ease-in-out transform hover:scale-110"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          <a
            href="#"
            className="text-gray-700 hover:text-gray-900 transition-transform duration-300 hover:scale-105"
            onClick={() => navigate("/customer")} // Navigate directly to home
          >
            Customer
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-900 transition-transform duration-300 hover:scale-105"
            onClick={() => navigate("/delivery-personnel")} // Navigate directly to home
          >
            Delivery personnel
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-900 transition-transform duration-300 hover:scale-105"
            onClick={() => navigate("/restaurant-admin")} // Navigate directly to home
          >
            Restaurant admin
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-900 transition-transform duration-300 hover:scale-105"
            onClick={() => navigate("/system-admin")} // Navigate directly to home
          >
            System Admin
                     </a>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
            >
              Sign Out
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/signup")}
                className="text-gray-800 hover:text-gray-900 transition-transform duration-300 hover:scale-105"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-transform duration-300 hover:scale-105"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out lg:hidden ${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col mt-4 space-y-4 items-center w-full">
          <a
            href="#"
            className="text-gray-700 hover:text-gray-900 transition-transform duration-300 hover:scale-105"
            onClick={() => navigate("/customer")} // Navigate directly to home
          >
            Customer
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-900 transition-transform duration-300 hover:scale-105"
            onClick={() => navigate("/delivery_personnel")} // Navigate directly to home
          >
            Delivery personnel
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-900 transition-transform duration-300 hover:scale-105"
            onClick={() => navigate("/restaurant-admin")} // Navigate directly to home
          >
            Restaurant admin
          </a>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition-transform duration-300 w-3/4 text-center"
            >
              Sign Out
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/register")}
                className="text-gray-800 hover:text-gray-900 transition-transform duration-300 hover:scale-105"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-transform duration-300 hover:scale-105"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
