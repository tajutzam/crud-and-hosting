import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Login.css';
import dishineLogo from '../assets/Dishine Logo.png';
import EyeFill from '../assets/eye-fill.svg';
import EyeShut from '../assets/eye-slash.svg';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const result = await login(email, password);

      if (result.success) {
            // Ambil data user dari response backend
            const user = result.data.user;

            // Arahkan ke /admin/dashboard jika role_id = 1 atau name = 'Admin'
            if (user.role_id === 1 || user.role?.name?.toLowerCase() === 'admin') {
            navigate('/admin/dashboard');
            } else {
            navigate('/'); // Atau halaman utama customer
            }
        }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="container-xl row m-auto">
        {/* Left Column (Logo for large screens) */}
        <div className="col-7 m-auto d-none d-lg-flex justify-content-center">
          <img src={dishineLogo} className="w-75" alt="Dishine Logo" />
        </div>

        {/* Right Column (Login Form) */}
        <div className="col-lg-5 col-sm-10 d-flex m-auto justify-content-center">
          <form className="form w-100" onSubmit={handleSubmit}>
            <h3 className="mb-3">Login to your account</h3>

            {error && (
              <div className="alert alert-danger mb-3" role="alert">
                {error}
              </div>
            )}

            {/* Email Field */}
            <p className="mb-1">Email</p>
            <input
              className="mb-3 form-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            {/* Password Field Header */}
            <div className="password-header d-flex justify-content-between align-items-center mb-1">
              <p className="m-0">Password</p>
              <Link to="/forgot-password" className="forgot-link ms-2">
                Forgot ?
              </Link>
            </div>

            {/* Password Input Wrapper */}
            <div className="password-input-wrapper mb-4 position-relative">
              <input
                className="form-input password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <span
                className="password-toggle-icon"
                onClick={togglePasswordVisibility}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={showPassword ? EyeFill : EyeShut}
                  alt={showPassword ? 'Hide Password' : 'Show Password'}
                  className="eye-icon-img"
                />
              </span>
            </div>

            {/* Submit Button */}
            <button className="button mb-3 w-100" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login Account'}
            </button>

            {/* Sign Up Link */}
            <p className="text-center">
              Don't Have An Account?
              <Link to="/register" className="link ms-2">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;