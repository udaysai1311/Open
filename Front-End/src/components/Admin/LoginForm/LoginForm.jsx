import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import './LoginForm.css';

const schema = yup.object().shape({
    email: yup.string()
        .required('Email is required')
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'),
    password: yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .test("password-check", "Password must include uppercase, number, and special character (e.g., Abc$123)", (value) => {
            if (!value) return false;

            const hasCapital = /[A-Z]/.test(value);
            const hasNumber = /[0-9]/.test(value);
            const hasSpecial = /[!@#$%^&*.?|<>]/.test(value);

            return hasCapital && hasNumber && hasSpecial;
        }),
});

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            const url = `${import.meta.env.VITE_API_BASE_URL}/auth/admin_login`;
            const response = await axios.post(url, data);
            console.log('Admin Login Response:', response.data);
            alert('Login Successful!');
            // TODO: Handle successful login
        } catch (error) {
            console.error('Login Error:', error);
            alert('Login Failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10 d-flex justify-content-center">
                        <div className="login-content-card">
                            <div className="glass-form-section">
                                {/* Header Image/Icon Section */}
                                <div className="login-header text-center mb-4">
                                    <div className="icon-wrapper">
                                        <svg className="login-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <linearGradient id="loginIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" style={{ stopColor: '#00d2ff', stopOpacity: 1 }} />
                                                    <stop offset="100%" style={{ stopColor: '#3a7bd5', stopOpacity: 1 }} />
                                                </linearGradient>
                                            </defs>
                                            {/* Shield shape */}
                                            <path d="M 50 10 L 75 20 L 75 45 Q 75 70 50 85 Q 25 70 25 45 L 25 20 Z"
                                                fill="url(#loginIconGradient)" opacity="0.3" stroke="url(#loginIconGradient)" strokeWidth="2" />
                                            {/* Lock body */}
                                            <rect x="40" y="50" width="20" height="18" rx="2"
                                                fill="url(#loginIconGradient)" opacity="0.8" />
                                            {/* Lock shackle */}
                                            <path d="M 43 50 L 43 42 Q 43 35 50 35 Q 57 35 57 42 L 57 50"
                                                fill="none" stroke="url(#loginIconGradient)" strokeWidth="3" strokeLinecap="round" />
                                            {/* Keyhole */}
                                            <circle cx="50" cy="57" r="2.5" fill="rgba(0,0,0,0.5)" />
                                            <rect x="48.5" y="57" width="3" height="6" fill="rgba(0,0,0,0.5)" />
                                        </svg>
                                    </div>
                                    <h2 className="text-white fw-bold fs-4 mt-3 mb-1">Welcome Back</h2>
                                    <p className="text-white-50 small mb-0">Enter your credentials to access your account.</p>
                                </div>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email address</label>
                                        <input
                                            type="email"
                                            className={`form-control glass-input ${errors.email ? 'is-invalid' : ''}`}
                                            id="email"
                                            placeholder="name@example.com"
                                            {...register('email')}
                                        />
                                        <div className="invalid-feedback">{errors.email?.message}</div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className={`form-control glass-input ${errors.password ? 'is-invalid' : ''}`}
                                            id="password"
                                            placeholder="••••••••"
                                            {...register('password')}
                                        />
                                        <div className="invalid-feedback">{errors.password?.message}</div>
                                    </div>
                                    <div className="d-grid pt-2">
                                        <button type="submit" className="btn glass-btn btn-sm">Sign In</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
