import { Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Register from "../pages/Register";
import Login from "../pages/Login";
import AboutUs from "../pages/AboutUs";
import Product from "../pages/Product";

export const PublicRoutes = (
  <>
    <Route path="/" element={<HomePage />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/about-us" element={<AboutUs />} />
    <Route path="/product" element={<Product />} />
    <Route path="/product/:id" element={<Product />} />
  </>
);