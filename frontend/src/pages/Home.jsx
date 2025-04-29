import { useAuth } from "../contexts/authContext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-200">
        <h1 className="text-4xl font-extrabold text-green-800 mb-4 text-center">
          Welcome to UberEats
        </h1>

        <p className="text-lg text-gray-700 mb-6 text-center">
          Delicious food, delivered fast to your door!
        </p>

        {isAuthenticated ? (
          <>
            <p className="text-lg text-gray-700 mb-8 text-center">
              Hello, {userRole}! Ready to order your favorite meal?
            </p>
            <Link
              to="/restaurants"
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
            >
              Browse Restaurants
            </Link>
          </>
        ) : (
          <>
            <p className="text-lg text-gray-700 mb-8 text-center">
              Please{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                log in
              </Link>{" "}
              or{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                sign up
              </Link>{" "}
              to start ordering.
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
