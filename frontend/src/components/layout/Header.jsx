import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { FiHeart, FiLogOut, FiMenu, FiSearch, FiShoppingBag, FiUser, FiX } from 'react-icons/fi';
import '../../styles/Header.css';
import dishineLogo from '../../assets/Dishine Logo Small.png';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');

  const submitSearch = (event) => {
    event.preventDefault();
    if (query.trim()) navigate(`/search?query=${encodeURIComponent(query.trim())}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLink = (to, label) => (
    <Link className={`header-link ${location.pathname === to ? 'is-active' : ''}`} to={to} onClick={() => setMobileOpen(false)}>
      {label}
    </Link>
  );

  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="mobile-menu-button" onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle menu">
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
        <Link to="/" className="brand" onClick={() => setMobileOpen(false)}>
          <img src={dishineLogo} alt="Dishine" />
          <span>DISHINE</span>
        </Link>
        <nav className={`main-nav ${mobileOpen ? 'is-open' : ''}`}>
          {navLink('/', 'Home')}
          {navLink('/about-us', 'About us')}
          {!isAuthenticated && navLink('/login', 'Login')}
          {!isAuthenticated && <Link className="nav-cta" to="/register" onClick={() => setMobileOpen(false)}>Join us</Link>}
        </nav>
        <form className="header-search" onSubmit={submitSearch}>
          <FiSearch />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search collection" aria-label="Search collection" />
        </form>
        <div className="header-actions">
          <button className="header-icon" aria-label="Wishlist"><FiHeart /></button>
          {isAuthenticated ? (
            <>
              <Link className="header-icon bag-icon" to="/cart" aria-label="Shopping cart"><FiShoppingBag />{cartCount > 0 && <span>{cartCount}</span>}</Link>
              <Link className="header-user" to="/my-account"><FiUser /><span>{user?.name || 'Account'}</span></Link>
              <button className="logout-button" onClick={handleLogout}><FiLogOut /></button>
            </>
          ) : <Link className="header-icon" to="/login" aria-label="Account"><FiUser /></Link>}
        </div>
      </div>
    </header>
  );
}

export default Header;
