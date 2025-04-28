import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute.jsx";

import LoginForm from "./components/LoginForm.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import Home from "./pages/Home.jsx";
import CustomerPage from "./pages/customerPage.jsx";
import RestaurantAdminPage from "./pages/restaurantAdminPage.jsx";
import DeliveryPersonnelPage from "./pages/deliveryPersonnelPage.jsx";
import PageNotFound from "./pages/errors/PageNotFound.jsx";
import Unauthorized from "./pages/errors/Unauthorized.jsx";
import RestaurantOrders from "./pages/restaurant-admin/components/restaurant-orders.jsx";
import DeliveryDetails from "./pages/delivery-person/components/delivery-details.jsx";
import ReadyDeliveries from "./pages/delivery-person/components/delivery-order.jsx";
import MyDeliveries from "./pages/delivery-person/components/my-delivery.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="font-sourceSans">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route
              path="/restaurant-orders"
              element={
                <RestaurantOrders restaurantId="64f9d5c0b6e4a3337f96789b" />
              }
            />

            <Route path="/ready-deliveries" element={<ReadyDeliveries />} />
            <Route path="/:deliveryId" element={<DeliveryDetails />} />
            <Route path="/deliveries" element={<MyDeliveries />} />

            <Route
              path="/customer"
              element={
                <RoleProtectedRoute allowedRoles={["customer"]}>
                  <CustomerPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/restaurant-admin"
              element={
                <RoleProtectedRoute allowedRoles={["restaurant_admin"]}>
                  <RestaurantAdminPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/delivery-personnel"
              element={
                <RoleProtectedRoute allowedRoles={["delivery_personnel"]}>
                  <DeliveryPersonnelPage />
                </RoleProtectedRoute>
              }
            />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
