import { useState } from "react";
import { NavLink } from "react-router-dom";
import { BiMenu, BiX } from "react-icons/bi"; // Make sure to install react-icons
import "./Header.css";

import dishinesmall from "../../assets/Dishine Logo Small.png";
import profilepic from "../../assets/ProfilePlaceholder.png";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper to close menu when a link is clicked
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="header d-flex flex-column justify-content-center p-0">
      
      {/* =======================
          DESKTOP VIEW (md and up)
         ======================= */}
      <div className="container-xl d-none d-md-flex">
        <div className="w-100 row p-2 align-items-center">
          
          {/* Logo */}
          <div className="col-1">
            <img src={dishinesmall} className="logo" alt="Dishine Logo" />
          </div>

          {/* Navigation Links */}
          <div className="col-10 d-flex justify-content-evenly align-items-center links">
            <NavLink to="/admin/dashboard" className="nav-item">Dashboard</NavLink>
            <NavLink to="/admin/products" className="nav-item">Products</NavLink>
            <NavLink to="/admin/categories" className="nav-item">Categories</NavLink>
            <NavLink to="/admin/orders" className="nav-item">Orders</NavLink>
            <NavLink to="/admin/customers" className="nav-item">Customers</NavLink>
          </div>

          {/* Profile Pic */}
          <div className="col-1 d-flex justify-content-end">
            <img
              src={profilepic}
              className="profilelogo"
              alt="Profile Picture"
            />
          </div>
        </div>
      </div>


      {/* =======================
          MOBILE VIEW (sm and below)
         ======================= */}
      <div className="container-fluid d-flex d-md-none justify-content-between align-items-center p-2 px-3 position-relative">
         {/* Left: Logo */}
         <div className="d-flex align-items-center">
            <img src={dishinesmall} className="logo" alt="Dishine Logo" />
         </div>

         {/* Right: Profile & Hamburger */}
         <div className="d-flex align-items-center gap-3">
            <img
              src={profilepic}
              className="profilelogo"
              alt="Profile Picture"
            />
            <button 
              className="icon-btn-plain text-dark" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <BiX size={30} /> : <BiMenu size={30} />}
            </button>
         </div>

         {/* Mobile Dropdown Menu */}
         {isMenuOpen && (
            <div className="mobile-admin-menu shadow-sm">
                <NavLink to="/admin/dashboard" className="mobile-nav-item" onClick={closeMenu}>Dashboard</NavLink>
                <NavLink to="/admin/products" className="mobile-nav-item" onClick={closeMenu}>Products</NavLink>
                <NavLink to="/admin/categories" className="mobile-nav-item" onClick={closeMenu}>Categories</NavLink>
                <NavLink to="/admin/orders" className="mobile-nav-item" onClick={closeMenu}>Orders</NavLink>
                <NavLink to="/admin/customers" className="mobile-nav-item" onClick={closeMenu}>Customers</NavLink>
            </div>
         )}
      </div>

      {/* Shadow Line */}
      <div className="shadow">
        <p className="p-0 m-0 text-none" style={{ visibility: "hidden" }}>w</p>
      </div>
    </div>
  );
}

export default Header;