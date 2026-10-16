import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import Dashboard from "../pages/Admin/Dashboard";
import Category from "../pages/Admin/Category";
import ProductAdmin from "../pages/Admin/ProductAdmin";
import Orders from "../pages/Admin/Orders/Orders";
import Customers from "../pages/Admin/Customers/Customers";

export const AdminRoutes = (
  <>
    <Route
      path="/admin"
      element={
        <ProtectedRoute role="admin">
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/Admin"
      element={
        <ProtectedRoute role="admin">
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute role="admin">
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/Admin/Dashboard"
      element={
        <ProtectedRoute role="admin">
          <Dashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/categories"
      element={
        <ProtectedRoute role="admin">
          <Category />
        </ProtectedRoute>
      }
    />
    <Route
      path="/Admin/Categories"
      element={
        <ProtectedRoute role="admin">
          <Category />
        </ProtectedRoute>
      }
    />
    
    <Route
      path="/admin/products"
      element={
        <ProtectedRoute role="admin">
          <ProductAdmin />
        </ProtectedRoute>
      }
    />
    <Route
      path="/Admin/Products"
      element={
        <ProtectedRoute role="admin">
          <ProductAdmin />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/orders"
      element={
        <ProtectedRoute role="admin">
          <Orders />
        </ProtectedRoute>
      }
    />
    <Route
      path="/Admin/Orders"
      element={
        <ProtectedRoute role="admin">
          <Orders />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/customers"
      element={
        <ProtectedRoute role="admin">
          <Customers />
        </ProtectedRoute>
      }
    />
    <Route
      path="/Admin/Customers"
      element={
        <ProtectedRoute role="admin">
          <Customers />
        </ProtectedRoute>
      }
    />
  </>
);
