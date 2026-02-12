import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import './ClientRegistration.css';

const schema = yup.object().shape({
    clientCode: yup.string().required('Client Code is required').max(5, 'Max 5 characters'),
    clientName: yup.string().required('Client Name is required'),
    clientEmail: yup.string().required('Client Email is required').email('Invalid email format'),
    clientPassword: yup.string()
        .required('Client Password is required')
        .min(6, 'Min 6 characters')
        .test("password-check", "Password must include uppercase, number, and special character (e.g., Abc$123)", (value) => {
            if (!value) return false;

            const hasCapital = /[A-Z]/.test(value);
            const hasNumber = /[0-9]/.test(value);
            const hasSpecial = /[!@#$%^&*.?|<>]/.test(value);

            return hasCapital && hasNumber && hasSpecial;
        }),
    reEnterClientPassword: yup.string()
        .oneOf([yup.ref('clientPassword'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    clientDBHostName: yup.string().required('DB HostName is required'),
    clientDBUserName: yup.string().required('DB UserName is required'),
    clientDBName: yup.string().required('DB Name is required'),
    clientDBPassword: yup.string().required('DB Password is required'),
    reEnterClientDBPassword: yup.string()
        .oneOf([yup.ref('clientDBPassword'), null], 'DB Passwords must match')
        .required('Confirm DB Password is required'),
});

const ClientRegistration = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            const url = `${import.meta.env.VITE_API_BASE_URL}/auth/client_registration`;
            await axios.post(url, data);
            console.log(data);
            alert('Client Registered Successfully!');
        } catch (error) {
            console.error('Error registering client:', error);
            alert('Registration Failed');
        }
    };

    return (
        <div className="registration-page-wrapper">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="registration-content-card">
                            <div className="glass-form-section">
                                {/* Header Image/Icon Section */}
                                <div className="registration-header text-center mb-4">
                                    <div className="icon-wrapper">
                                        <svg className="registration-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" style={{ stopColor: '#00d2ff', stopOpacity: 1 }} />
                                                    <stop offset="100%" style={{ stopColor: '#3a7bd5', stopOpacity: 1 }} />
                                                </linearGradient>
                                            </defs>
                                            {/* User icon with database */}
                                            <circle cx="50" cy="35" r="15" fill="url(#iconGradient)" opacity="0.8" />
                                            <path d="M 30 50 Q 30 45 35 45 L 65 45 Q 70 45 70 50 L 70 65 Q 70 70 65 70 L 35 70 Q 30 70 30 65 Z" fill="url(#iconGradient)" opacity="0.6" />
                                            {/* Database symbol */}
                                            <ellipse cx="50" cy="75" rx="20" ry="6" fill="none" stroke="url(#iconGradient)" strokeWidth="2" />
                                            <ellipse cx="50" cy="82" rx="20" ry="6" fill="none" stroke="url(#iconGradient)" strokeWidth="2" />
                                            <line x1="30" y1="75" x2="30" y2="82" stroke="url(#iconGradient)" strokeWidth="2" />
                                            <line x1="70" y1="75" x2="70" y2="82" stroke="url(#iconGradient)" strokeWidth="2" />
                                        </svg>
                                    </div>
                                    <h3 className="text-white fw-bold mt-3 mb-1">Client Registration</h3>
                                    <p className="text-white-50 small">Create a new client account with database configuration</p>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="row">
                                        {/* Left Column: Client Details */}
                                        <div className="col-md-6 mb-3">
                                            <h5 className="text-white-50 mb-3 border-bottom pb-2">Client Details</h5>

                                            <div className="mb-3">
                                                <label htmlFor="clientCode" className="form-label">Client Code</label>
                                                <input type="text" className={`form-control glass-input ${errors.clientCode ? 'is-invalid' : ''}`} id="clientCode" {...register('clientCode')} />
                                                <div className="invalid-feedback">{errors.clientCode?.message}</div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="clientName" className="form-label">Client Name</label>
                                                <input type="text" className={`form-control glass-input ${errors.clientName ? 'is-invalid' : ''}`} id="clientName" {...register('clientName')} />
                                                <div className="invalid-feedback">{errors.clientName?.message}</div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="clientEmail" className="form-label">Client Email</label>
                                                <input type="email" className={`form-control glass-input ${errors.clientEmail ? 'is-invalid' : ''}`} id="clientEmail" {...register('clientEmail')} />
                                                <div className="invalid-feedback">{errors.clientEmail?.message}</div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="clientPassword" className="form-label">Client Password</label>
                                                <input type="password" className={`form-control glass-input ${errors.clientPassword ? 'is-invalid' : ''}`} id="clientPassword" {...register('clientPassword')} />
                                                <div className="invalid-feedback">{errors.clientPassword?.message}</div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="reEnterClientPassword" className="form-label">Confirm Client Password</label>
                                                <input type="password" className={`form-control glass-input ${errors.reEnterClientPassword ? 'is-invalid' : ''}`} id="reEnterClientPassword" {...register('reEnterClientPassword')} />
                                                <div className="invalid-feedback">{errors.reEnterClientPassword?.message}</div>
                                            </div>
                                        </div>

                                        {/* Right Column: DB Details */}
                                        <div className="col-md-6 mb-3">
                                            <h5 className="text-white-50 mb-3 border-bottom pb-2">Database Details</h5>

                                            <div className="mb-3">
                                                <label htmlFor="clientDBHostName" className="form-label">DB HostName</label>
                                                <input type="text" className={`form-control glass-input ${errors.clientDBHostName ? 'is-invalid' : ''}`} id="clientDBHostName" {...register('clientDBHostName')} />
                                                <div className="invalid-feedback">{errors.clientDBHostName?.message}</div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="clientDBUserName" className="form-label">DB UserName</label>
                                                <input type="text" className={`form-control glass-input ${errors.clientDBUserName ? 'is-invalid' : ''}`} id="clientDBUserName" {...register('clientDBUserName')} />
                                                <div className="invalid-feedback">{errors.clientDBUserName?.message}</div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="clientDBName" className="form-label">DB Name</label>
                                                <input type="text" className={`form-control glass-input ${errors.clientDBName ? 'is-invalid' : ''}`} id="clientDBName" {...register('clientDBName')} />
                                                <div className="invalid-feedback">{errors.clientDBName?.message}</div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="clientDBPassword" className="form-label">DB Password</label>
                                                <input type="password" className={`form-control glass-input ${errors.clientDBPassword ? 'is-invalid' : ''}`} id="clientDBPassword" {...register('clientDBPassword')} />
                                                <div className="invalid-feedback">{errors.clientDBPassword?.message}</div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="reEnterClientDBPassword" className="form-label">Confirm DB Password</label>
                                                <input type="password" className={`form-control glass-input ${errors.reEnterClientDBPassword ? 'is-invalid' : ''}`} id="reEnterClientDBPassword" {...register('reEnterClientDBPassword')} />
                                                <div className="invalid-feedback">{errors.reEnterClientDBPassword?.message}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end mt-4 gap-2">
                                        <Link to="/view-all-clients" className="btn glass-btn-secondary btn-sm">View All Clients</Link>
                                        <button type="submit" className="btn glass-btn btn-sm">Create Client</button>
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

export default ClientRegistration;