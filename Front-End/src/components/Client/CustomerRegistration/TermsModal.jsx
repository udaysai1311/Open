import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
// import './TermsModal.css';

const TermsModal = ({ isOpen, onClose, onSave, initialText, title }) => {
    const [text, setText] = useState(initialText || '');

    useEffect(() => {
        setText(initialText || '');
    }, [initialText, isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div className="modal fade show" style={{ display: 'block' }} id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="false">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-content-style">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{title || 'Terms & Conditions'}</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <textarea
                                className="form-control terms-textarea"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter terms and conditions here..."
                                rows={10}
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={() => onSave(text)}>
                                <Save size={16} style={{ marginRight: '8px' }} />
                                Save Terms
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default TermsModal;
