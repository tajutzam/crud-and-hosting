import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout/Checkout";
import MyAccount from "../pages/MyAccount";

export const UserRoutes = (
  <>
    <Route
      path="/cart"
      element={
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      }
    />
    <Route
      path="/Cart"
      element={
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      }
    />
    <Route
      path="/checkout"
      element={
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      }
    />
    <Route
      path="/Checkout"
      element={
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      }
    />
    <Route
      path="/my-account"
      element={
        <ProtectedRoute>
          <MyAccount />
        </ProtectedRoute>
      }
    />
  </>
);
