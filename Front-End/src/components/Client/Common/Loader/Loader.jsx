import { useEffect } from 'react';
import './Loader.css';

const Loader = ({ visible }) => {
    useEffect(() => {
        if (visible) {
            // Disable scrolling when loader is visible
            document.body.style.overflow = 'hidden';
        } else {
            // Re-enable scrolling
            document.body.style.overflow = 'unset';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [visible]);

    if (!visible) return null;

    return (
        <div className="loader-overlay">
            <div className="loader-container">
                <div className="loader-ring"></div>
                <div className="loader-ring-inner"></div>
                <div className="loader-core"></div>
            </div>
        </div>
    );
};

export default Loader;