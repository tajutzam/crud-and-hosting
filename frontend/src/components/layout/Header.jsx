import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import '../../styles/Header.css'
import dishineLogo from '../../assets/Dishine Logo Small.png'
import CartLogo from '../../assets/Cart.png'
import ProfilePlaceholderLogo from '../../assets/ProfilePlaceholder.png'

function Header(){
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const { cartCount } = useCart();

    const isCartActive = location.pathname === '/Cart';

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const w1 = {
        width: '40%'
    };

    const w2 = {
        width: '40%'
    };

    const w3 = {
        width: '20%'
    }

    const ws = {
        width: '12%'
    };

    return(
        <div className='d-none d-lg-flex justify-content-center position-absolute w-100'>
            <div className='navbar py-2 px-2 container-xxl d-flex flex-row justify-content-center'>
                <nav className='navbar-content d-flex flex-row align-items-center'>
                    <div className='justify-content-evenly d-flex align-items-center' style={w1}>
                        <Link to="/" className="d-flex align-items-center text-dark text-decoration-none">
                            <img src={dishineLogo} alt="Dishine Logo" className='col-4' style={ws} />
                        </Link>
                        <Link to="/" className="mx-2 text-dark text-decoration-none">
                            Home
                        </Link>
                        <Link to="/about-us" className="mx-2 text-dark text-decoration-none">
                            About Us
                        </Link>
                    </div>
                    <div className='d-flex pe-2 justify-content-end align-items-center' style={w2}>
                        <div className='search d-flex flex-row align-items-center justify-content-center'>
                            <div className='searchfield'>
                                Search
                            </div>
                        </div>
                    </div>
                    <div className='justify-content-around d-flex align-items-center' style={w3}>
                        {isAuthenticated ? (
                            <>
                                <span>
                                    <Link to="/Cart" className="d-flex align-items-center position-relative">
                                        <div className={`icon ${isCartActive ? 'active-icon' : ''}`}>
                                            <img src={CartLogo} alt="Cart" />
                                        </div>
                                        {cartCount > 0 && (
                                            <span 
                                                className="position-absolute badge rounded-pill bg-danger"
                                                style={{ top: '-4px', right: '-8px', fontSize: '10px', padding: '3px 6px' }}
                                            >
                                                {cartCount}
                                            </span>
                                        )}
                                    </Link>
                                </span>
                                <span>
                                    <Link to="/my-account" className="d-flex align-items-center">
                                        <div className='icon'>
                                            <img src={ProfilePlaceholderLogo} alt="Profile" />
                                        </div>
                                    </Link>
                                </span>
                                {user && (
                                    <span className="text-dark ms-2">
                                        {user.name || user.email}
                                    </span>
                                )}
                                <button 
                                    onClick={handleLogout}
                                    className="btn btn-link text-dark text-decoration-none ms-2"
                                    style={{ border: 'none', background: 'none', padding: 0 }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/Login" className="text-dark text-decoration-none mx-2">
                                    Login
                                </Link>
                                <Link to="/Register" className="text-dark text-decoration-none mx-2">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
                <hr />
            </div>
        </div>
    );
}

export default Header