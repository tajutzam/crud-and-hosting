import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/Register.css'
import dishineLogo from '../assets/Dishine Logo.png'
import EyeFill from '../assets/eye-fill.svg'
import EyeShut from '../assets/eye-slash.svg' 

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const result = await register({ name, email, password });
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Registration failed. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div>
            <div className='register'>
                <div className='container-xl row'>
                    <div className='col-7 m-auto d-none d-lg-flex'>
                        <img src={dishineLogo} className='w-75' alt="Dishine Logo" />
                    </div>
                    <div className='col-lg-5 col-sm-10 d-flex m-auto justify-content-center'>
                        <form className='form' onSubmit={handleSubmit}>
                            <h3 className='mb-3'>
                                Create an account
                            </h3>
                            {error && <div className='alert alert-danger mb-3' role='alert'>{error}</div>}
                            <p>Name</p>
                            <input className='mb-3 form-input' type='text' value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
                            <p>Email</p>
                            <input
                                className='mb-3 form-input'
                                type='email'
                                placeholder='Enter your email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />

                            <p>
                                Password
                            </p>
                            <div className='password-input-wrapper mb-4'>
                                <input
                                    className='form-input'
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

                            <button className='button mb-3' type='submit' disabled={loading}>
                                {loading ? 'Creating account...' : 'Create account'}
                            </button>
                            <p className='text-center'>
                                Already have an account?
                                <Link to="/login" className='link ms-2'>
                                    Log In
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;