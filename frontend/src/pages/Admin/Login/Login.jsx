import React, { useState } from 'react';

import './Login.css'

import EyeFill from '../../../assets/eye-fill.svg'
import EyeShut from '../../../assets/eye-slash.svg' 

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
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

        const result = await login(email, password);
        
        if (result.success) {
            navigate('/');
        } else {
            console.log(result);
            setError(result.error || 'Login failed. Please try again.');
        }
        
        setLoading(false);
    };

    return (
        <div>
            <div className='register'>
                <div className='container-xl row'>
<<<<<<<< HEAD:src/pages/Login.jsx
                    <div className='col-7 m-auto d-none d-lg-flex'>
                        <img src={dishineLogo} className='w-75' alt="Dishine Logo" />
                    </div>
                    <div className='col-lg-5 col-sm-10 d-flex m-auto justify-content-center'>
                        <form className='form' onSubmit={handleSubmit}>
========
                    <div className='col-11 col-sm-10 col-lg-6 d-flex m-auto justify-content-center'>
                        <form className='form'>
>>>>>>>> refs/remotes/origin/main:src/pages/Admin/Login/Login.jsx
                            <h3 className='mb-3'>
                                Login to your account
                            </h3>
                            
                            {error && (
                                <div className='alert alert-danger mb-3' role='alert'>
                                    {error}
                                </div>
                            )}

                            <p>
                                Email
                            </p>
                            <input
                                className='mb-3 form-input'
                                type='email'
                                placeholder='Enter your email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />

                            <div className='password-header'>
                                <p>
                                    Password
                                </p>
                                <a href="" className='forgot-link ms-2'>
                                    Forgot ?
                                </a>
                            </div>

                            <div className='password-input-wrapper mb-4'>
                                <input
                                    className='form-input password-input'
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='Enter your password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                                <span
                                    className='password-toggle-icon'
                                    onClick={togglePasswordVisibility}
                                >
                                    <img 
                                        src={showPassword ? EyeFill : EyeShut} 
                                        alt={showPassword ? "Hide Password" : "Show Password"}
                                        className='eye-icon-img' 
                                    />
                                </span>
                            </div>

                            <button 
                                className='button mb-3' 
                                type='submit'
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login Account'}
                            </button>
<<<<<<<< HEAD:src/pages/Login.jsx
                            <p className='text-center'>
                                Don't Have An Account?
                                <Link to="/Register" className='link ms-2'>
                                    Sign Up
                                </Link>
                            </p>
========
>>>>>>>> refs/remotes/origin/main:src/pages/Admin/Login/Login.jsx
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;