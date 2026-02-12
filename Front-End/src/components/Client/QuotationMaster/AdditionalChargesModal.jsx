import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, DollarSign, Percent, Info } from 'lucide-react';
import SearchableSelect from '../Common/SearchableSelect/SearchableSelect';
import './AdditionalChargesModal.css';

const CHARGE_OPTIONS = [
    { label: 'CGST', value: 'CGST' },
    { label: 'SGST', value: 'SGST' },
    { label: 'IGST', value: 'IGST' },
    { label: 'Discount', value: 'Discount' },
    { label: 'Freight charges', value: 'Freight charges' },
    { label: 'Packing charges', value: 'Packing charges' },
    { label: 'Handling / forwarding charges', value: 'Handling / forwarding charges' },
    { label: 'Bank charges', value: 'Bank charges' },
    { label: 'LC / remittance charges', value: 'LC / remittance charges' },
    { label: 'Currency exchange fluctuation charges', value: 'Currency exchange fluctuation charges' },
    { label: 'Transit insurance', value: 'Transit insurance' },
    { label: 'Marine / cargo insurance', value: 'Marine / cargo insurance' },
    { label: 'Customs clearance charges', value: 'Customs clearance charges' },
    { label: 'Export documentation charges', value: 'Export documentation charges' }
];

const AdditionalChargesModal = ({ isOpen, onClose, quotation, initialCharges, onSave, onShowToast }) => {
    const [charges, setCharges] = useState(initialCharges?.items || initialCharges || []);
    const [notApplicable, setNotApplicable] = useState(initialCharges?.notApplicable || false);
    const [selectedType, setSelectedType] = useState('');
    const [amount, setAmount] = useState('');
    const [remark, setRemark] = useState('');

    useEffect(() => {
        if (initialCharges) {
            if (Array.isArray(initialCharges)) {
                setCharges(initialCharges);
                setNotApplicable(false);
            } else {
                setCharges(initialCharges.items || []);
                setNotApplicable(initialCharges.notApplicable || false);
            }
        } else {
            setCharges([]);
            setNotApplicable(false);
        }
    }, [initialCharges]);

    const handleAddCharge = () => {
        if (notApplicable) {
            onShowToast('error', 'Please uncheck "No Additional Charges Applicable" to add charges.', 'Action Blocked');
            return;
        }

        if (!selectedType || !amount) {
            onShowToast('error', 'Please select a charge type and enter an amount.', 'Validation Error');
            return;
        }

        if (charges.some(c => c.type === selectedType)) {
            onShowToast('error', 'This charge type has already been added.', 'Duplicate Entry');
            return;
        }

        const newCharge = {
            id: Date.now(),
            type: selectedType,
            amount: parseFloat(amount),
            remark: remark
        };

        setCharges([...charges, newCharge]);
        setSelectedType('');
        setAmount('');
        setRemark('');
    };

    const handleRemoveCharge = (id) => {
        setCharges(charges.filter(c => c.id !== id));
    };

    const handleSave = () => {
        onSave(quotation.id, { items: charges, notApplicable });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="ac-modal-overlay" onClick={onClose}>
            <div className="ac-modal-content" onClick={e => e.stopPropagation()}>
                <div className="ac-modal-header">
                    <div className="ac-header-title">
                        <h3>Additional Charges</h3>
                        <p>{quotation.quotation_number} - {quotation.customer_name}</p>
                    </div>
                    <button className="ac-close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="ac-modal-body">
                    <div className="ac-form">
                        <div className="ac-form-row">
                            <div className="ac-form-group ac-type-select">
                                <label>Charge Type</label>
                                <SearchableSelect
                                    options={CHARGE_OPTIONS.map(opt => ({
                                        ...opt,
                                        disabled: charges.some(c => c.type === opt.value)
                                    }))}
                                    value={selectedType}
                                    onChange={(val) => setSelectedType(val)}
                                    placeholder="Search or Select Type"
                                />
                            </div>
                            <div className="ac-form-group">
                                <label>Amount</label>
                                <div className="ac-amount-wrapper">
                                    <span className="ac-currency-icon">{quotation.currency === 'INR' ? '₹' : '$'}</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="ac-input-amount"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="ac-form-group">
                            <label>Remark (Optional)</label>
                            <input
                                type="text"
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                className="ac-input"
                                placeholder="Add a note..."
                            />
                        </div>

                        <div className="ac-form-row ac-checkbox-row">
                            <label className="ac-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={notApplicable}
                                    onChange={(e) => {
                                        setNotApplicable(e.target.checked);
                                        if (e.target.checked) setCharges([]);
                                    }}
                                />
                                No Additional Charges Applicable
                            </label>
                        </div>

                        <button className="ac-add-btn" onClick={handleAddCharge} disabled={notApplicable}>
                            <Plus size={18} /> Add Charge
                        </button>
                    </div>

                    <div className="ac-charges-list">
                        <h4>Current Charges</h4>
                        {charges.length === 0 ? (
                            <div className="ac-empty-state">
                                <Info size={24} />
                                <p>No additional charges added yet.</p>
                            </div>
                        ) : (
                            <div className="ac-table-wrapper">
                                <table className="ac-table">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Amount</th>
                                            <th>Remark</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {charges.map(charge => (
                                            <tr key={charge.id}>
                                                <td>{charge.type}</td>
                                                <td>{quotation.currency === 'INR' ? '₹' : '$'}{charge.amount.toFixed(2)}</td>
                                                <td>{charge.remark || '-'}</td>
                                                <td>
                                                    <button className="ac-remove-btn" onClick={() => handleRemoveCharge(charge.id)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="1"><strong>Total</strong></td>
                                            <td colSpan="3"><strong>{quotation.currency === 'INR' ? '₹' : '$'}{charges.reduce((sum, c) => sum + c.amount, 0).toFixed(2)}</strong></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div className="ac-modal-footer">
                    <button className="ac-btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="ac-btn-primary" onClick={handleSave}>
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdditionalChargesModal;
