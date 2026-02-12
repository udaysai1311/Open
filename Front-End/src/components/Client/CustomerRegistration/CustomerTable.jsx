import React, { useState } from 'react';
import { Pencil, Save, X, Trash2, FileText, Power, Building2, User, Briefcase, Phone, Mail, MapPin, FileCheck } from 'lucide-react';
import TermsModal from './TermsModal';
import './CustomerTable.css';

const CMFormRow = ({ item, onSave, onOpenTerms, onToggleStatus }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedItem, setEditedItem] = useState({ ...item });

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setEditedItem({ ...item });
        setIsEditing(false);
    };

    const handleSaveClick = () => {
        onSave(editedItem);
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // For phone number, only allow digits and limit to 10
        if (name === 'phoneNo') {
            const numericValue = value.replace(/\D/g, '').slice(0, 10);
            setEditedItem(prev => ({
                ...prev,
                [name]: numericValue
            }));
        } else {
            setEditedItem(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    return (
        <tr>
            <td hidden>{item.customerId}</td>
            <td>{item.customerName}</td>
            <td>{item.customerAbbr}</td>
            <td>
                {isEditing ? (
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        name="contactPerson"
                        value={editedItem.contactPerson || ''}
                        onChange={handleChange}
                    />
                ) : (
                    item.contactPerson
                )}
            </td>
            <td>
                {isEditing ? (
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        name="designation"
                        value={editedItem.designation || ''}
                        onChange={handleChange}
                    />
                ) : (
                    item.designation
                )}
            </td>
            <td>
                {isEditing ? (
                    <input
                        type="tel"
                        className="form-control form-control-sm"
                        name="phoneNo"
                        value={editedItem.phoneNo || ''}
                        onChange={handleChange}
                        pattern="[0-9]{10}"
                        maxLength="10"
                        minLength="10"
                        placeholder="10-digit phone"
                        title="Please enter exactly 10 digits"
                    />
                ) : (
                    item.phoneNo
                )}
            </td>
            <td>
                {isEditing ? (
                    <input
                        type="email"
                        className="form-control form-control-sm"
                        name="email"
                        value={editedItem.email || ''}
                        onChange={handleChange}
                    />
                ) : (
                    item.email
                )}
            </td>
            <td>
                {isEditing ? (
                    <textarea
                        className="form-control form-control-sm"
                        name="customerAddress"
                        value={editedItem.customerAddress || ''}
                        onChange={handleChange}
                        rows="2"
                    />
                ) : (
                    item.customerAddress
                )}
            </td>
            <td className='text-center'>
                <button
                    className={`terms-icon-btn ${item.terms ? 'has-content' : ''}`}
                    onClick={() => onOpenTerms(item, false)}
                    title="Edit Terms & Conditions"
                >
                    <FileText size={16} />
                </button>
            </td>
            <td className='text-center'>
                {isEditing ? (
                    <>
                        <button className="action-btn save-btn" onClick={handleSaveClick} title="Save">
                            <Save size={16} />
                        </button>
                        <button className="action-btn cancel-btn" onClick={handleCancelClick} title="Cancel">
                            <X size={16} />
                        </button>
                    </>
                ) : (
                    <>
                        {item.isActive !== false && (
                            <button className="action-btn" onClick={handleEditClick} title="Edit">
                                <Pencil size={16} />
                            </button>
                        )}
                        <button
                            className={`action-btn ${item.isActive === false ? 'disabled-btn' : 'active-btn'}`}
                            onClick={() => onToggleStatus(item.customerId, item.isActive !== false)}
                            title={item.isActive === false ? "Enable Customer" : "Disable Customer"}
                        >
                            <Power size={16} />
                        </button>
                    </>
                )}
            </td>
        </tr>
    );
};

const NewCustomerRow = ({ customer, onChange, onRemove, onOpenTerms }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        // For phone number, only allow digits and limit to 10
        if (name === 'phoneNo') {
            const numericValue = value.replace(/\D/g, '').slice(0, 10);
            onChange(customer.tempId, name, numericValue);
        } else {
            onChange(customer.tempId, name, value);
        }
    };

    return (
        <tr className="new-customer-row">
            <td hidden>{customer.tempId}</td>
            <td>
                <input
                    type="text"
                    className="form-control form-control-sm"
                    name="customerName"
                    value={customer.customerName}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    required
                />
            </td>
            <td>
                <input
                    type="text"
                    className="form-control form-control-sm"
                    name="customerAbbr"
                    value={customer.customerAbbr}
                    onChange={handleChange}
                    placeholder="Abbr"
                    required
                />
            </td>
            <td>
                <input
                    type="text"
                    className="form-control form-control-sm"
                    name="contactPerson"
                    value={customer.contactPerson}
                    onChange={handleChange}
                    placeholder="Contact person"
                />
            </td>
            <td>
                <input
                    type="text"
                    className="form-control form-control-sm"
                    name="designation"
                    value={customer.designation}
                    onChange={handleChange}
                    placeholder="Designation"
                />
            </td>
            <td>
                <input
                    type="tel"
                    className="form-control form-control-sm"
                    name="phoneNo"
                    value={customer.phoneNo}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    maxLength="10"
                    minLength="10"
                    placeholder="10-digit phone"
                    title="Please enter exactly 10 digits"
                />
            </td>
            <td>
                <input
                    type="email"
                    className="form-control form-control-sm"
                    name="email"
                    value={customer.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
            </td>
            <td>
                <textarea
                    className="form-control form-control-sm"
                    name="customerAddress"
                    value={customer.customerAddress}
                    onChange={handleChange}
                    placeholder="Address"
                    rows="2"
                />
            </td>
            <td className='text-center'>
                <button
                    className={`terms-icon-btn ${customer.terms ? 'has-content' : ''}`}
                    onClick={() => onOpenTerms(customer, true)}
                    title="Add Terms & Conditions"
                >
                    <FileText size={16} />
                </button>
            </td>
            <td className='text-center'>
                <button
                    className="action-btn cancel-btn"
                    onClick={() => onRemove(customer.tempId)}
                    title="Remove"
                >
                    <Trash2 size={16} />
                </button>
            </td>
        </tr>
    );
};

const CustomerTable = ({ data, newCustomers = [], onUpdate, onNewCustomerChange, onRemoveNewCustomer, onToggleStatus }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [currentTerms, setCurrentTerms] = useState('');
    const [currentTitle, setCurrentTitle] = useState('');
    const [activeItem, setActiveItem] = useState(null);
    const [isNewCustomer, setIsNewCustomer] = useState(false);

    const handleOpenTerms = (item, isNew) => {
        setActiveItem(item);
        setIsNewCustomer(isNew);
        setCurrentTerms(item.terms || '');
        setCurrentTitle(`Terms for ${item.customerName || 'New Customer'}`);
        setModalOpen(true);
    };

    const handleSaveTerms = (text) => {
        if (isNewCustomer) {
            onNewCustomerChange(activeItem.tempId, 'terms', text);
        } else {
            // For existing customers, send only customerId and terms to API
            onUpdate({ ...activeItem, terms: text }, true); // true = termsOnly
        }
        setModalOpen(false);
    };
    return (
        <div className="table-responsive">
            <table className="table">
                <thead>
                    <tr>
                        <th hidden>Customer ID</th>
                        <th><div className="th-content"><Building2 size={24} /> Customer Name <span className='required'>*</span></div></th>
                        <th><div className="th-content"><FileText size={24} /> Customer Abbr <span className='required'>*</span></div></th>
                        <th><div className="th-content"><User size={24} /> Contact Person</div></th>
                        <th><div className="th-content"><Briefcase size={20} /> Designation</div></th>
                        <th><div className="th-content"><Phone size={22} /> Phone No</div></th>
                        <th><div className="th-content"><Mail size={20} /> Email</div></th>
                        <th><div className="th-content"><MapPin size={24} /> Customer Address</div></th>
                        <th><div className="th-content"><FileCheck size={20} /> Terms</div></th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {newCustomers.map((customer) => (
                        <NewCustomerRow
                            key={customer.tempId}
                            customer={customer}
                            onChange={onNewCustomerChange}
                            onRemove={onRemoveNewCustomer}
                            onOpenTerms={handleOpenTerms}
                        />
                    ))}
                    {data.map((item, index) => (
                        <CMFormRow
                            key={item.customerId || index}
                            index={index}
                            item={item}
                            onSave={onUpdate}
                            onOpenTerms={handleOpenTerms}
                            onToggleStatus={onToggleStatus}
                        />
                    ))}
                </tbody>
            </table>

            <TermsModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveTerms}
                initialText={currentTerms}
                title={currentTitle}
            />
        </div>
    );
};

export default CustomerTable;
