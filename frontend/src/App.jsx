import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ManageGroups from "./pages/ManageGroups";
import ManageChains from "./pages/ManageChains";
import ManageBrands from "./pages/ManageBrands";
import ManageZones from "./pages/ManageZones";

import ManageEstimates from "./pages/Manageestimates";
import ManageInvoices from "./pages/ManageInvoices";
import CreateInvoice from "./pages/CreateInvoice"; // ✅ ADD THIS

// ================= PRIVATE ROUTE =================
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

// ================= ROUTES =================
function AppRoutes() {
  return (
    <Routes>
      {/* DEFAULT */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* MASTER DATA */}
      <Route
        path="/groups"
        element={
          <PrivateRoute>
            <ManageGroups />
          </PrivateRoute>
        }
      />

      <Route
        path="/chains"
        element={
          <PrivateRoute>
            <ManageChains />
          </PrivateRoute>
        }
      />

      <Route
        path="/brands"
        element={
          <PrivateRoute>
            <ManageBrands />
          </PrivateRoute>
        }
      />

      <Route
        path="/zones"
        element={
          <PrivateRoute>
            <ManageZones />
          </PrivateRoute>
        }
      />

      {/* ESTIMATES */}
      <Route
        path="/estimates"
        element={
          <PrivateRoute>
            <ManageEstimates />
          </PrivateRoute>
        }
      />

      {/* ✅ NEW CREATE INVOICE PAGE */}
      <Route
        path="/create-invoice"
        element={
          <PrivateRoute>
            <CreateInvoice />
          </PrivateRoute>
        }
      />

      {/* INVOICES */}
      <Route
        path="/invoices"
        element={
          <PrivateRoute>
            <ManageInvoices />
          </PrivateRoute>
        }
      />

      {/* ❌ REMOVE THIS OLD ROUTE */}
      {/* <Route path="/invoices/create/:estimatedId" ... /> */}

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// ================= APP =================
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}