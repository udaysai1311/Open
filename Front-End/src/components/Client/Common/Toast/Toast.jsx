import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'success', isOpen, onClose, duration = 3000 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                handleClose();
            }, duration);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [isOpen, duration]);

    const handleClose = () => {
        setIsVisible(false);
        // Delay the actual onClose call to allow exit animation
        setTimeout(onClose, 300);
    };

    if (!isOpen && !isVisible) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={20} />;
            case 'error': return <XCircle size={20} />;
            case 'warning': return <AlertCircle size={20} />;
            default: return <CheckCircle size={20} />;
        }
    };

    return (
        <div className={`toast-container ${isVisible ? 'show' : 'hide'} ${type}`}>
            <div className="toast-content">
                <div className="toast-icon">
                    {getIcon()}
                </div>
                <div className="toast-message">
                    {message}
                </div>
                <button className="toast-close-btn" onClick={handleClose}>
                    <X size={16} />
                </button>
            </div>
            <div className="toast-progress">
                <div
                    className="toast-progress-bar"
                    style={{ animationDuration: `${duration}ms` }}
                />
            </div>
        </div>
    );
};

export default Toast;
