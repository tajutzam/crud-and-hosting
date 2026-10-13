import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BiSearch, BiMenu, BiX } from "react-icons/bi"; // Import icons
import './Header.css'
import dishineLogo from './assets/Dishine Logo Small.png'
import CartLogo from './assets/Cart.png'
import ProfilePlaceholderLogo from './assets/ProfilePlaceholder.png'

function Header(){
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false); // Toggle for mobile search bar
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Toggle for hamburger menu
    
    const navigate = useNavigate();

    // Function to handle the search submission
    const handleSearch = (e) => {
        e.preventDefault(); 
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
            setIsSearchOpen(false); // Close search bar after searching
        }
    };

    const w1 = { width: '40%' };
    const w2 = { width: '40%' };
    const w3 = { width: '20%' };
    const ws = { width: '12%' };

    return(
        <div className='d-flex justify-content-center position-fixed w-100 z-3'>
            
            {/* === MOBILE NAVBAR (Visible only on lg screens and smaller) === */}
            <div className='d-flex d-lg-none navbar-small align-items-center justify-content-between px-3 position-relative'>
                
                {isSearchOpen ? (
                    /* --- MODE 1: SEARCH OPEN --- */
                    <div className="w-100 d-flex align-items-center gap-2">
                        <form onSubmit={handleSearch} className='mobile-search-container flex-grow-1 d-flex align-items-center px-3'>
                            <input 
                                type="text" 
                                className='mobile-search-input w-100 border-0 bg-transparent' 
                                placeholder="Search products..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </form>
                        {/* Close Search Button */}
                        <button onClick={() => setIsSearchOpen(false)} className="icon-btn-plain">
                            <BiX size={28} />
                        </button>
                    </div>
                ) : (
                    /* --- MODE 2: DEFAULT NAV --- */
                    <>
                        {/* Left: Logo Only */}
                        <NavLink to="/" className="d-flex align-items-center" style={{ width: '35px' }}>
                            <img src={dishineLogo} alt="Dishine Logo" className='w-100' />
                        </NavLink>

                        {/* Right: Icons Group */}
                        <div className='d-flex align-items-center gap-3'>
                            
                            {/* 1. Search Icon (Triggers Mode 1) */}
                            <button onClick={() => setIsSearchOpen(true)} className="icon-btn-plain text-dark">
                                <BiSearch size={24} />
                            </button>

                            {/* 2. Cart Icon */}
                            <NavLink to="/Cart" className="icon-link">
                                <div className='mobile-icon'>
                                    <img src={CartLogo} alt="Cart" />
                                </div>
                            </NavLink>

                            {/* 3. Profile Icon */}
                            <NavLink to="/MyAccount" className="icon-link">
                                <div className='mobile-icon'>
                                    <img src={ProfilePlaceholderLogo} alt="Profile" />
                                </div>
                            </NavLink>

                            {/* 4. Hamburger Menu (Toggles Dropdown) */}
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="icon-btn-plain text-dark">
                                {isMenuOpen ? <BiX size={28} /> : <BiMenu size={28} />}
                            </button>
                        </div>
                    </>
                )}

                {/* --- HAMBURGER MENU DROPDOWN --- */}
                {isMenuOpen && !isSearchOpen && (
                    <div className="mobile-menu-dropdown shadow-sm">
                        <NavLink to="/" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)} end>
                            Home
                        </NavLink>
                        <NavLink to="/AboutUs" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>
                            About Us
                        </NavLink>
                    </div>
                )}
            </div>


            {/* === DESKTOP NAVBAR (Hidden on smaller screens) === */}
            <div className='navbar py-2 px-2 container-xxl d-none d-lg-flex flex-row justify-content-center text-white'>
                <nav className='navbar-content d-flex flex-row align-items-center w-100'>
                    
                    {/* LEFT SECTION */}
                    <div className='justify-content-evenly d-flex align-items-center' style={w1}>
                        <NavLink to="/" style={ws}>
                            <img src={dishineLogo} alt="Dishine Logo" className='w-100' />
                        </NavLink>
                        <NavLink to="/" className="nav-link-custom" end>Home</NavLink>
                        <NavLink to="/AboutUs" className="nav-link-custom">About Us</NavLink>
                    </div>

                    {/* MIDDLE SECTION: Search Bar */}
                    <div className='d-flex pe-2 justify-content-end align-items-center' style={w2}>
                        <div className='search d-flex flex-row align-items-center justify-content-center'>
                            <form onSubmit={handleSearch} className='w-100 d-flex justify-content-center'>
                                <input 
                                    type="text" 
                                    className='searchfield border-0 bg-transparent' 
                                    placeholder="Search" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </form>
                        </div>
                    </div>

                    {/* RIGHT SECTION */}
                    <div className='justify-content-around d-flex align-items-center' style={w3}>
                        <NavLink to="/Cart" className="icon-link">
                            <div className='icon'>
                                <img src={CartLogo} alt="Cart" />
                            </div>
                        </NavLink>
                        <NavLink to="/MyAccount" className="icon-link">
                            <div className='icon'>
                                <img src={ProfilePlaceholderLogo} alt="My Account" />
                            </div>
                        </NavLink>
                    </div>

                </nav>
                <hr />
            </div>
        </div>
    );
}

export default Header