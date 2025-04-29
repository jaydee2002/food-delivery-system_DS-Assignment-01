import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import RoleProtectedRoute from "./routes/RoleProtectedRoute.jsx";

import MainLayout from "./components/layout/MainLayout.js";
import Home from "./pages/main/Home.jsx"; // Keep only this Home
import RestaurantSignupForm from "./pages/Auth/RestaurantSignupForm.jsx";

import AuthLayout from "./components/layout/AuthLayout.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";

import DashboardLayout from "./components/layout/DashboardLayout.js";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Tickets from "./pages/Dashboard/Tickets.jsx";
import RestaurantApproval from "./pages/Dashboard/RestaurantApproval.jsx";
import Customers from "./pages/Dashboard/Customers.jsx";
import AllCustomers from "./pages/Dashboard/AllCustomers.jsx";
import NewCustomers from "./pages/Dashboard/NewCustomers.jsx";
import VIPCustomers from "./pages/Dashboard/VIPCustomers.jsx";
import Products from "./pages/Dashboard/Products.jsx";
import Orders from "./pages/Dashboard/Orders.jsx";
import Analytics from "./pages/Dashboard/Analytics.jsx";
import SalesReport from "./pages/Dashboard/SalesReport.jsx";
import UserAnalytics from "./pages/Dashboard/UserAnalytics.jsx";
import Settings from "./pages/Dashboard/Settings.jsx";
import RestaurantAdminPage from "./pages/restaurantAdminPage.jsx";

// import Profile from "./pages/main/Profile.jsx";

import SystemAdminPage from "./pages/systemAdminPage.jsx";
// import DeliveryPersonnelPage from "./pages/deliveryPersonnelPage.jsx";

import PageNotFound from "./pages/errors/PageNotFound.jsx";
import Unauthorized from "./pages/errors/Unauthorized.jsx";
import DeliveryDetails from "./pages/delivery-person/components/delivery-details.jsx";
import ReadyDeliveries from "./pages/delivery-person/components/delivery-order.jsx";
import MyDeliveries from "./pages/delivery-person/components/my-delivery.jsx";

import PaymentPage from "./pages/PaymentPage.jsx";
import PaymentHistory from "./pages/PaymentHistory.jsx"; // Import PaymentHistory page
// import Sidebar from "./components/dashboard/Sidebar.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main layout routes */}
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/" element={<Home />} />

            <Route path="/ready-deliveries" element={<ReadyDeliveries />} />
            <Route path="/:deliveryId" element={<DeliveryDetails />} />
            <Route path="/deliveries" element={<MyDeliveries />} />

            <Route
              path="/restaurant-admin"
              element={
                <RestaurantAdminPage
                  restaurantId={"64f9d5c0b6e4a3337f96789b"}
                />
              }
            />
            {/* <Route
              path="/customer"
              element={
                <RoleProtectedRoute allowedRoles={["customer"]}>
                  <Profile />
                </RoleProtectedRoute>
              }
            /> */}
          </Route>

          {/* Auth layout routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/restaurant-register"
              element={
                <RoleProtectedRoute
                  allowedRoles={["customer", "restaurant_admin"]}
                >
                  <RestaurantSignupForm />
                </RoleProtectedRoute>
              }
            />
            {/* <Route
              path="/delivery-personnel"
              element={
                <RoleProtectedRoute allowedRoles={["delivery_personnel"]}>
                  <DeliveryPersonnelPage />
                </RoleProtectedRoute>
              }
            /> */}
            <Route
              path="/system-admin"
              element={
                <RoleProtectedRoute allowedRoles={["system_admin"]}>
                  <SystemAdminPage />
                </RoleProtectedRoute>
              }
            />
            <Route path="/pay" element={<PaymentPage />} />
            <Route path="/payment-history" element={<PaymentHistory />} />{" "}
            {/* New route for Payment History */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>

          {/* Dashboard layout routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route
              path="/restaurant-approval"
              element={<RestaurantApproval />}
            />
            <Route
              path="/restaurant-admin"
              element={
                <RestaurantAdminPage
                  restaurantId={"64f9d5c0b6e4a3337f96789b"}
                />
              }
            />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/all" element={<AllCustomers />} />
            <Route path="/customers/new" element={<NewCustomers />} />
            <Route path="/customers/vip" element={<VIPCustomers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/analytics/sales" element={<SalesReport />} />
            <Route path="/analytics/users" element={<UserAnalytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Catch all */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
