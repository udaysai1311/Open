import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Save, X, FileText, Trash2, ChevronDown, Calendar, Printer, Percent } from 'lucide-react';
import { Calendar as DateRangeCalendar } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

// Custom Dropdown Component
const CustomDropdown = ({ value, onChange, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="qt-custom-dropdown" ref={dropdownRef}>
            <div
                className="qt-dropdown-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={!selectedOption ? 'qt-placeholder' : ''}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`qt-dropdown-arrow ${isOpen ? 'open' : ''}`} size={14} />
            </div>
            {isOpen && (
                <div className="qt-dropdown-menu">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`qt-dropdown-item ${option.value === value ? 'selected' : ''}`}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Custom Date Picker Component with react-date-range
const CustomDatePicker = ({ value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dateRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dateRef.current && !dateRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDisplayDate = (dateString) => {
        if (!dateString) return '';
        try {
            return format(new Date(dateString), 'dd/MM/yyyy');
        } catch {
            return '';
        }
    };

    const handleDateChange = (date) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        onChange(formattedDate);
        setIsOpen(false);
    };

    const selectedDate = value ? new Date(value) : new Date();

    return (
        <div className="qt-custom-datepicker" ref={dateRef}>
            <div
                className="qt-datepicker-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Calendar size={14} className="qt-calendar-icon" />
                <span className={!value ? 'qt-placeholder' : ''}>
                    {value ? formatDisplayDate(value) : placeholder || 'Select date'}
                </span>
            </div>
            {isOpen && (
                <div className="qt-datepicker-popup">
                    <DateRangeCalendar
                        date={selectedDate}
                        onChange={handleDateChange}
                        color="#667eea"
                        rangeColors={['#667eea']}
                    />
                </div>
            )}
        </div>
    );
};

const QuotationTable = ({
    data,
    newQuotations,
    onUpdate,
    onNewQuotationChange,
    onRemoveNewQuotation,
    onViewLines,
    onOpenCharges,
    onPrint
}) => {
    const [editingId, setEditingId] = useState(null);
    const [editedData, setEditedData] = useState({});

    const statusOptions = [
        { value: 'Draft', label: 'Draft' },
        { value: 'Under Review', label: 'Under Review' },
        { value: 'Approved', label: 'Approved' },
        { value: 'Rejected', label: 'Rejected' },
        { value: 'Frozen', label: 'Frozen' }
    ];

    const currencyOptions = [
        { value: 'USD', label: 'USD' },
        { value: 'EUR', label: 'EUR' },
        { value: 'GBP', label: 'GBP' },
        { value: 'INR', label: 'INR' }
    ];

    const handleEdit = (quotation) => {
        setEditingId(quotation.id);
        setEditedData({ ...quotation });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditedData({});
    };

    const handleSave = () => {
        onUpdate(editedData);
        setEditingId(null);
        setEditedData({});
    };

    const handleChange = (field, value) => {
        setEditedData(prev => ({ ...prev, [field]: value }));
    };

    const handlePrintClick = (quotation) => {
        const charges = additionalCharges[quotation.id] || [];
        if (charges.length === 0) {
            alert('Please add additional charges before printing.');
        } else {
            onPrint(quotation);
        }
    };

    const getStatusBadge = (status) => {
        const statusClass = status.toLowerCase().replace(' ', '-');
        return <span className={`status-badge ${statusClass}`}>{status}</span>;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return format(new Date(dateString), 'dd/MM/yyyy');
        } catch {
            return '';
        }
    };

    const renderCell = (quotation, field, isEditing) => {
        if (isEditing && editingId === quotation.id) {
            if (field === 'status') {
                return (
                    <CustomDropdown
                        value={editedData[field] || ''}
                        onChange={(value) => handleChange(field, value)}
                        options={statusOptions}
                        placeholder="Select status"
                    />
                );
            } else if (field === 'enquiry_date' || field === 'quotation_date' || field === 'valid_till') {
                return (
                    <CustomDatePicker
                        value={editedData[field] || ''}
                        onChange={(value) => handleChange(field, value)}
                        placeholder="Select date"
                    />
                );
            } else {
                return (
                    <input
                        type="text"
                        className="form-control-sm"
                        value={editedData[field] || ''}
                        onChange={(e) => handleChange(field, e.target.value)}
                    />
                );
            }
        }

        if (field === 'status') {
            return getStatusBadge(quotation[field]);
        }

        if (field === 'enquiry_date' || field === 'quotation_date' || field === 'valid_till') {
            return formatDate(quotation[field]);
        }

        return quotation[field] || '-';
    };

    return (
        <div className="table-responsive">
            <table className="quotation-table">
                <thead>
                    <tr>
                        <th>Quotation No.</th>
                        <th>Revision</th>
                        <th>Customer Name</th>
                        <th>Our Drawing Ref</th>
                        <th>Customer Drawing Ref</th>
                        <th>Drawing Desc</th>
                        <th>Contact Person</th>
                        <th>Enquiry No.</th>
                        <th>Enquiry Date</th>
                        <th>Quotation Date</th>
                        <th>Valid Till</th>
                        <th>Currency</th>
                        <th>Status</th>
                        <th>Line Items</th>
                        <th>Remark</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {/* New Quotations */}
                    {newQuotations.map((quotation) => (
                        <tr key={quotation.tempId} className="new-quotation-row">
                            <td>
                                <input
                                    type="text"
                                    className="form-control-sm"
                                    placeholder="QTN-2025-XXX"
                                    value={quotation.quotation_number}
                                    onChange={(e) => onNewQuotationChange(quotation.tempId, 'quotation_number', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="form-control-sm"
                                    value={quotation.revision_number}
                                    onChange={(e) => onNewQuotationChange(quotation.tempId, 'revision_number', e.target.value)}
                                    disabled
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className="form-control-sm"
                                    placeholder="Customer Name"
                                    value={quotation.customer_name}
                                    onChange={(e) => onNewQuotationChange(quotation.tempId, 'customer_name', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className="form-control-sm"
                                    placeholder="Our Ref"
                                    value={quotation.our_drawing_ref}
                                    onChange={(e) => onNewQuotationChange(quotation.tempId, 'our_drawing_ref', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className="form-control-sm"
                                    placeholder="Cust Ref"
                                    value={quotation.customer_drawing_ref}
                                    onChange={(e) => onNewQuotationChange(quotation.tempId, 'customer_drawing_ref', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className="form-control-sm"
                                    placeholder="Description"
                                    value={quotation.drawing_desc}
                                    onChange={(e) => onNewQuotationChange(quotation.tempId, 'drawing_desc', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className="form-control-sm"
                                    placeholder="Contact Person"
                                    value={quotation.contact_person}
                                    onChange={(e) => onNewQuotationChange(quotation.tempId, 'contact_person', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className="form-control-sm"
                                    placeholder="ENQ-XXX"
                                    value={quotation.enquiry_number}
                                    onChange={(e) => onNewQuotationChange(quotation.tempId, 'enquiry_number', e.target.value)}
                                />
                            </td>
                            <td>
                                <CustomDatePicker
                                    value={quotation.enquiry_date}
                                    onChange={(value) => onNewQuotationChange(quotation.tempId, 'enquiry_date', value)}
                                    placeholder="Enquiry date"
                                />
                            </td>
                            <td>
                                <CustomDatePicker
                                    value={quotation.quotation_date}
                                    onChange={(value) => onNewQuotationChange(quotation.tempId, 'quotation_date', value)}
                                    placeholder="Quotation date"
                                />
                            </td>
                            <td>
                                <CustomDatePicker
                                    value={quotation.valid_till}
                                    onChange={(value) => onNewQuotationChange(quotation.tempId, 'valid_till', value)}
                                    placeholder="Valid till"
                                />
                            </td>
                            <td>
                                <CustomDropdown
                                    value={quotation.currency}
                                    onChange={(value) => onNewQuotationChange(quotation.tempId, 'currency', value)}
                                    options={currencyOptions}
                                    placeholder="Currency"
                                />
                            </td>
                            <td>
                                <CustomDropdown
                                    value={quotation.status}
                                    onChange={(value) => onNewQuotationChange(quotation.tempId, 'status', value)}
                                    options={statusOptions}
                                    placeholder="Status"
                                />
                            </td>
                            <td className="text-center">
                                <span className="line-count-badge">0</span>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className="form-control-sm"
                                    placeholder="Remark"
                                    value={quotation.remark}
                                    onChange={(e) => onNewQuotationChange(quotation.tempId, 'remark', e.target.value)}
                                />
                            </td>
                            <td>
                                <button
                                    className="action-btn delete-btn"
                                    onClick={() => onRemoveNewQuotation(quotation.tempId)}
                                    title="Remove"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}

                    {/* Existing Quotations */}
                    {data.map((quotation) => (
                        <tr key={quotation.id}>
                            <td>{renderCell(quotation, 'quotation_number', false)}</td>
                            <td>
                                <span className={`revision-badge ${quotation.revision_number > 0 ? 'revised' : ''}`}>
                                    Rev {quotation.revision_number}
                                </span>
                            </td>
                            <td>{renderCell(quotation, 'customer_name', false)}</td>
                            <td>{renderCell(quotation, 'our_drawing_ref', true)}</td>
                            <td>{renderCell(quotation, 'customer_drawing_ref', true)}</td>
                            <td>{renderCell(quotation, 'drawing_desc', true)}</td>
                            <td>{renderCell(quotation, 'contact_person', false)}</td>
                            <td>{renderCell(quotation, 'enquiry_number', true)}</td>
                            <td>{renderCell(quotation, 'enquiry_date', true)}</td>
                            <td>{renderCell(quotation, 'quotation_date', true)}</td>
                            <td>{renderCell(quotation, 'valid_till', true)}</td>
                            <td>{renderCell(quotation, 'currency', false)}</td>
                            <td>{renderCell(quotation, 'status', true)}</td>
                            <td className="text-center">
                                <button
                                    className="line-count-btn"
                                    onClick={() => onViewLines(quotation)}
                                    title="View/Edit Line Items"
                                >
                                    <FileText size={14} />
                                    <span className="line-count-badge">{quotation.line_count || 0}</span>
                                </button>
                            </td>
                            <td>{renderCell(quotation, 'remark', true)}</td>
                            <td>
                                {editingId === quotation.id ? (
                                    <>
                                        <button
                                            className="action-btn save-btn"
                                            onClick={handleSave}
                                            title="Save"
                                        >
                                            <Save size={16} />
                                        </button>
                                        <button
                                            className="action-btn cancel-btn"
                                            onClick={handleCancel}
                                            title="Cancel"
                                        >
                                            <X size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="action-btn"
                                            onClick={() => handleEdit(quotation)}
                                            title="Edit Header"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className="action-btn"
                                            onClick={() => onOpenCharges(quotation)}
                                            title="Additional Charges"
                                        >
                                            <Percent size={16} />
                                        </button>
                                        {quotation.status === 'Approved' && (
                                            <button
                                                className="action-btn view-btn"
                                                onClick={() => onPrint(quotation)}
                                                title="Print"
                                            >
                                                <Printer size={16} />
                                            </button>
                                        )}
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default QuotationTable;
