import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, Download, Bird } from 'lucide-react';
import { format } from 'date-fns';
import './QuotationPrintTemplate.css';

const QuotationPrintTemplate = ({ quotation, lines = [], additionalCharges = [], onClose, isOpen }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('print-preview-open');
        } else {
            document.body.classList.remove('print-preview-open');
        }
        return () => document.body.classList.remove('print-preview-open');
    }, [isOpen]);

    if (!isOpen || !quotation) return null;

    // Calculations
    const subtotal = lines.reduce((sum, line) => sum + (line.total_price || 0), 0);

    // Process additional charges (Tax, Discount, etc.)
    const taxCharges = additionalCharges.filter(c => c.type.toLowerCase().includes('gst') || c.type.toLowerCase().includes('tax'));
    const discountCharges = additionalCharges.filter(c => c.type.toLowerCase().includes('discount'));
    const otherCharges = additionalCharges.filter(c =>
        !c.type.toLowerCase().includes('gst') &&
        !c.type.toLowerCase().includes('tax') &&
        !c.type.toLowerCase().includes('discount')
    );

    const taxTotal = taxCharges.reduce((sum, c) => sum + c.amount, 0);
    const discountTotal = discountCharges.reduce((sum, c) => sum + (c.amount || 0), 0);
    const otherTotal = otherCharges.reduce((sum, c) => sum + (c.amount || 0), 0);

    const grandTotal = subtotal + taxTotal + otherTotal - discountTotal;

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), 'dd/MM/yyyy');
        } catch {
            return dateString;
        }
    };

    const content = (
        <div className="gpt-overlay">
            <div className="gpt-actions">
                <button className="gpt-btn-close" onClick={onClose} title="Close Preview">
                    <X size={20} />
                </button>
                <button className="gpt-btn-print" onClick={handlePrint}>
                    <Printer size={18} /> Print Quotation
                </button>
            </div>

            <div className="gpt-document-container">
                <div className="gpt-document">
                    {/* Header with Logo */}
                    <div className="gpt-header">
                        <div className="gpt-logo-section">
                            <div className="gpt-logo-owl">
                                <Bird size={32} strokeWidth={2} />
                            </div>
                            <h1 className="gpt-business-name">Business Name</h1>
                        </div>
                    </div>

                    {/* Quotation Banner and Metadata */}
                    <div className="gpt-banner-section">
                        <div className="gpt-banner">
                            <div className="gpt-banner-lines"></div>
                            <h2>QUOTATION</h2>
                        </div>
                        <div className="gpt-meta-top">
                            <div className="gpt-meta-item">
                                <span className="label">Valid till:</span>
                                <span className="value">{formatDate(quotation.valid_till)}</span>
                            </div>
                            <div className="gpt-meta-item">
                                <span className="label">Total:</span>
                                <span className="value highlighted">
                                    {quotation.currency === 'INR' ? '₹' : '$'}{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quotation Details */}
                    <div className="gpt-details-section">
                        <div className="gpt-quote-info">
                            <p><strong>Quote Number:</strong> {quotation.quotation_number}</p>
                            <p><strong>Date:</strong> {formatDate(quotation.quotation_date)}</p>
                        </div>
                    </div>

                    <hr className="gpt-divider" />

                    {/* Address Section */}
                    <div className="gpt-addresses">
                        <div className="gpt-address-block">
                            <h4>Quote from:</h4>
                            <p className="company-name">Your Company Name</p>
                            <p>123 Industrial Area, Phase 1</p>
                            <p>City, State, Zip - 000000</p>
                            <p>Phone: +91 98765 43210</p>
                        </div>
                        <div className="gpt-address-block to-block">
                            <h4>Quote to:</h4>
                            <p className="company-name">{quotation.customer_name}</p>
                            <p>Customer Street Address, Zip Code</p>
                            <p>City, State</p>
                            <p>Phone: {quotation.phone_no || 'Contact Number'}</p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="gpt-table-section">
                        <table className="gpt-table">
                            <thead>
                                <tr>
                                    <th className="item-col">Item</th>
                                    <th className="rate-col">Rate</th>
                                    <th className="qty-col">Quantity</th>
                                    <th className="total-col">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lines.map((line, index) => (
                                    <tr key={line.id || index}>
                                        <td className="item-col">
                                            <div className="item-name">{line.material_grade || 'Standard Grade'}</div>
                                            <div className="item-desc">{line.drawing_description || line.drawing_number}</div>
                                        </td>
                                        <td className="rate-col">
                                            {quotation.currency === 'INR' ? '₹' : '$'}{(line.unit_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="qty-col">{line.no_of_units || 0}</td>
                                        <td className="total-col">
                                            {quotation.currency === 'INR' ? '₹' : '$'}{(line.total_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Section */}
                    <div className="gpt-summary-container">
                        <div className="gpt-notes">
                            <h4>Payment instructions</h4>
                            <p>Bank: HDFC Bank</p>
                            <p>A/c No: 000011112222</p>
                            <p>IFSC: HDFC0001234</p>
                        </div>
                        <div className="gpt-summary">
                            <div className="summary-row">
                                <span className="label">Subtotal:</span>
                                <span className="value">{quotation.currency === 'INR' ? '₹' : '$'}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            {discountTotal > 0 && (
                                <div className="summary-row">
                                    <span className="label">Discount:</span>
                                    <span className="value">-{quotation.currency === 'INR' ? '₹' : '$'}{discountTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            )}
                            {taxCharges.map(c => (
                                <div className="summary-row" key={c.id}>
                                    <span className="label">{c.type}:</span>
                                    <span className="value">{quotation.currency === 'INR' ? '₹' : '$'}{c.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            ))}
                            {otherCharges.map(c => (
                                <div className="summary-row" key={c.id}>
                                    <span className="label">{c.type}:</span>
                                    <span className="value">{quotation.currency === 'INR' ? '₹' : '$'}{c.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            ))}
                            <div className="summary-row grand-total-row">
                                <div className="total-label-box">Total</div>
                                <div className="total-value-box">
                                    {quotation.currency === 'INR' ? '₹' : '$'}{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(content, document.body);
};

export default QuotationPrintTemplate;
