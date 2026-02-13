import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, UserPlus, Building2, Plus, Save } from 'lucide-react';
import CustomerTable from './CustomerTable';
import Toast from '../Common/Toast/Toast';
import { useUser } from '../../../context/UserContext';
import './CustomerRegistration.css';

const CustomerRegistration = () => {
    const [customerNames, setCustomerNames] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredNames, setFilteredNames] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [customerDetails, setCustomerDetails] = useState([]);
    const [newCustomers, setNewCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const dropdownRef = useRef(null);
    const { user } = useUser();

    // Toast State
    const [toast, setToast] = useState({
        isOpen: false,
        type: 'success',
        message: ''
    });

    const showStatus = (type, message) => {
        setToast({
            isOpen: true,
            type,
            message
        });
    };

    const closeToast = () => {
        setToast(prev => ({ ...prev, isOpen: false }));
    };

    // Fetch all customer names on mount
    useEffect(() => {
        const fetchCustomerNames = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_CUSTOMER_FOR_SEARCH_API_URL);
                const mappedData = response.data.map(c => ({
                    customerId: c.customer_id,
                    customerName: c.customer_name,
                }));
                setCustomerNames(mappedData);
                setFilteredNames(mappedData);
            } catch (error) {
                //console.error('Error fetching customer names:', error);
                //showStatus('error', 'Failed to fetch customer list.');
            }
        };

        fetchCustomerNames();
    }, []);

    // Handle outside click to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearchInput = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowDropdown(true);

        if (value.trim() === '') {
            setFilteredNames(customerNames);
        } else {
            const filtered = customerNames.filter(customer =>
                customer.customerName.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredNames(filtered);
        }
    };

    const handleNameSelect = (customer) => {
        setSearchTerm(customer.customerName);
        setSelectedCustomerId(customer.customerId);
        setShowDropdown(false);
    };

    const handleSearchClick = async () => {
        if (!selectedCustomerId) {
            showStatus('warning', 'Please select a customer from the list.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(import.meta.env.VITE_CUSTOMER_DETAILS_API_URL.replace('{customerId}', selectedCustomerId));
            const c = response.data;
            const mappedCustomer = {
                customerId: c.customer_id,
                customerName: c.customer_name,
                email: c.email,
                phoneNo: c.phone,
                customerAddress: c.address,
                isActive: c.is_active,
                customerAbbr: c.customer_abbr || '',
                contactPerson: c.contact_person || '',
                designation: c.contact_person_designation || '',
                terms: c.terms || '',
            };
            setCustomerDetails([mappedCustomer]);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching customer details:', error);
            setLoading(false);
            showStatus('error', 'Failed to fetch customer details.');
        }
    };

    const handleUpdateCustomer = async (updatedCustomer, termsOnly = false) => {
        try {
            if (termsOnly) {
                const url = import.meta.env.VITE_CUSTOMER_SAVE_TERMS_API_URL.replace('{customerId}', updatedCustomer.customerId);
                await axios.put(url, { terms: updatedCustomer.terms });
            } else {
                // For full update
                const url = import.meta.env.VITE_CUSTOMER_UPDATE_API_URL.replace('{customerId}', updatedCustomer.customerId);
                const payload = {
                    customer_name: updatedCustomer.customerName,
                    customer_abbr: updatedCustomer.customerAbbr,
                    contact_person: updatedCustomer.contactPerson,
                    contact_person_designation: updatedCustomer.designation,
                    email: updatedCustomer.email,
                    phone: updatedCustomer.phoneNo,
                    address: updatedCustomer.customerAddress,
                    updated_by: user?.userId ? String(user.userId) : "Admin",
                    is_active: updatedCustomer.isActive
                };
                await axios.put(url, payload);
            }

            // Update local state
            setCustomerDetails(prev => prev.map(item =>
                item.customerId === updatedCustomer.customerId ? updatedCustomer : item
            ));

            showStatus('success', termsOnly ? 'Terms updated successfully!' : 'Customer updated successfully!');
        } catch (error) {
            console.error('Error updating customer:', error);
            showStatus('error', 'Failed to update customer.');
        }
    };

    const handleToggleCustomerStatus = async (customerId, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            // Select endpoint based on NEW status (if true -> enable, if false -> disable)
            const urlVariable = newStatus
                ? import.meta.env.VITE_CUSTOMER_ENABLE_API_URL
                : import.meta.env.VITE_CUSTOMER_DISABLE_API_URL;

            const url = urlVariable.replace('{customerId}', customerId);

            await axios.put(url);

            // Update local state
            setCustomerDetails(prev => prev.map(item =>
                item.customerId === customerId ? { ...item, isActive: newStatus } : item
            ));

            showStatus('success', `Customer ${newStatus ? 'enabled' : 'disabled'} successfully!`);
        } catch (error) {
            console.error('Error toggling customer status:', error);
            showStatus('error', 'Failed to toggle customer status.');
        }
    };

    const handleAddCustomer = () => {
        const newCustomer = {
            tempId: Date.now(),
            customerName: '',
            customerAbbr: '',
            contactPerson: '',
            designation: '',
            phoneNo: '',
            email: '',
            customerAddress: ''
        };
        setNewCustomers(prev => [newCustomer, ...prev]);
    };

    const handleNewCustomerChange = (tempId, field, value) => {
        setNewCustomers(prev => prev.map(customer =>
            customer.tempId === tempId ? { ...customer, [field]: value } : customer
        ));
    };

    const handleRemoveNewCustomer = (tempId) => {
        setNewCustomers(prev => prev.filter(customer => customer.tempId !== tempId));
    };

    const handleSaveAll = async () => {
        if (newCustomers.length === 0) return;

        // Validate required fields
        const invalidCustomers = newCustomers.filter(c => !c.customerName?.trim() || !c.customerAbbr?.trim());
        if (invalidCustomers.length > 0) {
            showStatus('warning', 'Please fill in Customer Name and Customer Abbr for all new customers.');
            return;
        }

        setSaving(true);
        try {
            const customersToSend = newCustomers.map(customer => ({
                customer_name: customer.customerName,
                customer_abbr: customer.customerAbbr,
                contact_person: customer.contactPerson,
                contact_person_designation: customer.designation,
                email: customer.email,
                phone: customer.phoneNo,
                address: customer.customerAddress,
                created_by: user?.userId ? String(user.userId) : "Admin",
                is_active: true
            }));

            const response = await axios.post(import.meta.env.VITE_CUSTOMER_REGISTRATION_API_URL, customersToSend);

            // Assuming response.data is the list of saved customers (in snake_case)
            const savedCustomers = response.data.map(c => ({
                customerId: c.customer_id,
                customerName: c.customer_name,
                email: c.email,
                phoneNo: c.phone,
                customerAddress: c.address,
                isActive: c.is_active,
                customerAbbr: c.customer_abbr || '',
                contactPerson: c.contact_person || '',
                designation: c.contact_person_designation || '',
                terms: c.terms || '',
            }));
            setCustomerDetails(prev => [...savedCustomers, ...prev]);
            setNewCustomers([]);
            setSaving(false);
            showStatus('success', `${savedCustomers.length} customer(s) saved successfully!`);

            // Refresh customer names list for search
            const namesResponse = await axios.get(import.meta.env.VITE_CUSTOMER_FOR_SEARCH_API_URL);
            const mappedNames = namesResponse.data.map(c => ({
                customerId: c.customer_id,
                customerName: c.customer_name,
            }));
            setCustomerNames(mappedNames);
            setFilteredNames(mappedNames);

        } catch (error) {
            console.error('Error saving customers:', error);
            setSaving(false);
            showStatus('error', 'Failed to save customers.');
        }
    };

    return (
        <div className="customer-registration-wrapper">
            <div className="registration-container">
                <div className="page-header">
                    <div className="header-icon-wrapper">
                        <UserPlus className="header-icon" size={32} />
                    </div>
                    <div>
                        <h2 className="page-title">Customer Registration</h2>
                        <p className="page-subtitle">Manage customer details and information</p>
                    </div>
                </div>

                <div className="search-card">
                    <div className="search-section">
                        <div className="search-input-group" ref={dropdownRef}>
                            <label className="search-label">Customer Name</label>
                            <div className="input-wrapper">
                                <Search className="input-icon" size={18} />
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search customer name..."
                                    value={searchTerm}
                                    onChange={handleSearchInput}
                                    onFocus={() => setShowDropdown(true)}
                                />
                            </div>
                            {showDropdown && (
                                <div className="search-dropdown">
                                    {filteredNames.length > 0 ? (
                                        filteredNames.map((customer) => (
                                            <div
                                                key={customer.customerId}
                                                className="dropdown-item"
                                                onClick={() => handleNameSelect(customer)}
                                            >
                                                <Building2 size={14} className="item-icon" />
                                                {customer.customerName}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="dropdown-item text-muted">No results found</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <button className="btn-search" onClick={handleSearchClick} disabled={loading || !searchTerm}>
                            {loading ? (<span className="loading-spinner"></span>) : (<><Search size={18} /><span>Search</span></>)}
                        </button>
                        <button className="btn-add-customer" onClick={handleAddCustomer}>
                            <Plus size={18} />
                            <span>Add Customer</span>
                        </button>
                        {newCustomers.length > 0 && (
                            <button className="btn-save-all" onClick={handleSaveAll} disabled={saving}>
                                {saving ? (
                                    <span className="loading-spinner"></span>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Save All ({newCustomers.length})</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {(newCustomers.length > 0 || customerDetails.length > 0) && (
                    <div className="results-section">
                        <CustomerTable
                            data={customerDetails}
                            newCustomers={newCustomers}
                            onUpdate={handleUpdateCustomer}
                            onNewCustomerChange={handleNewCustomerChange}
                            onRemoveNewCustomer={handleRemoveNewCustomer}
                            onToggleStatus={handleToggleCustomerStatus}
                        />
                    </div>
                )}
            </div>

            <Toast
                isOpen={toast.isOpen}
                onClose={closeToast}
                type={toast.type}
                message={toast.message}
            />
        </div>
    );
};

export default CustomerRegistration;
