import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import './ClientLoginForm.css';

const schema = yup.object().shape({
    companyCode: yup.string()
        .required('Company Code is required')
        .min(3, 'Company Code must be at least 3 characters')
        .max(10, 'Company Code must not exceed 10 characters')
        .matches(/^[A-Za-z0-9]+$/, 'Company Code must be alphanumeric'),
    email: yup.string()
        .required('Email is required')
        .email('Invalid email address')
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),
    password: yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .max(50, 'Password must not exceed 50 characters')
        .test("password-check", "Password must include uppercase, number, and special character (e.g., Abc$123)", (value) => {
            if (!value) return false;

            const hasCapital = /[A-Z]/.test(value);
            const hasNumber = /[0-9]/.test(value);
            const hasSpecial = /[!@#$%^&*.?|<>]/.test(value);

            return hasCapital && hasNumber && hasSpecial;
        }),
});

const ClientLoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            const url = `${import.meta.env.VITE_API_BASE_URL}/auth/client_login`;
            const response = await axios.post(url, data);
            console.log('Client Login Response:', response.data);
            alert('Login Successful!');
            // TODO: Handle successful login (e.g., redirect, store token)
        } catch (error) {
            console.error('Login Error:', error);
            alert('Login Failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="client-login-wrapper">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-7">
                        <div className="client-login-card">
                            <div className="client-form-section">
                                {/* Header with Logo */}
                                <div className="client-login-header">
                                    <div className="client-icon-wrapper">
                                        {/* Bracket Logo matching the image */}
                                        <svg className="client-login-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="48" height="48" rx="12" fill="#1c1c1c" />
                                            <path d="M18 14C18 14 14 18 14 24C14 30 18 34 18 34" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                            <path d="M30 14C30 14 34 18 34 24C34 30 30 34 30 34" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                            <circle cx="24" cy="24" r="2" fill="#2563eb" />
                                        </svg>
                                    </div>
                                    <h2>Welcome Back</h2>
                                    <p>Sign in to your account</p>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {/* Company Code Field */}
                                    <div className="form-group">
                                        <div className="input-icon-wrapper">
                                            <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M3 21h18M5 21V7l8-4 8 4v14M12 11v4" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <input
                                                type="text"
                                                className={`client-glass-input ${errors.companyCode ? 'is-invalid' : ''}`}
                                                placeholder="Company Code"
                                                {...register('companyCode')}
                                            />
                                        </div>
                                        {errors.companyCode && <div className="invalid-feedback">{errors.companyCode.message}</div>}
                                    </div>

                                    {/* Email Field */}
                                    <div className="form-group">
                                        <div className="input-icon-wrapper">
                                            <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                <polyline points="22,6 12,13 2,6" />
                                            </svg>
                                            <input
                                                type="email"
                                                className={`client-glass-input ${errors.email ? 'is-invalid' : ''}`}
                                                placeholder="Email Address"
                                                {...register('email')}
                                            />
                                        </div>
                                        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                                    </div>

                                    {/* Password Field */}
                                    <div className="form-group">
                                        <div className="input-icon-wrapper">
                                            <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                            </svg>
                                            <input
                                                type="password"
                                                className={`client-glass-input ${errors.password ? 'is-invalid' : ''}`}
                                                placeholder="Password"
                                                {...register('password')}
                                            />
                                        </div>
                                        {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                                    </div>

                                    {/* Submit Button */}
                                    <button type="submit" className="client-glass-btn">Login</button>

                                    {/* Footer Options */}
                                    <div className="form-options">
                                        <div className="form-check">
                                            <input className="form-check-input client-checkbox" type="checkbox" id="rememberMe" />
                                            <label className="form-check-label small" htmlFor="rememberMe">Remember me</label>
                                        </div>
                                        <a href="#" className="client-link small" style={{ color: '#a1a1aa', fontWeight: 'normal' }}>Forgot Password?</a>
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

export default ClientLoginForm;
