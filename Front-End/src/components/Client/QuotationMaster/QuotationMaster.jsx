import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, FileText, Plus, Save, Building2 } from 'lucide-react';
import QuotationTable from './QuotationTable';
import QuotationLineModal from './QuotationLineModal';
import Toast from '../Common/Toast/Toast';
import './QuotationMaster.css';
import AdditionalChargesModal from './AdditionalChargesModal';
import QuotationPrintTemplate from './QuotationPrintTemplate';

const QuotationMaster = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [quotations, setQuotations] = useState([]);
    const [newQuotations, setNewQuotations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const dropdownRef = useRef(null);

    // Line Modal State
    const [lineModal, setLineModal] = useState({
        isOpen: false,
        quotationId: null,
        quotationNumber: '',
        customerName: '',
        status: '',
    });
    // Toast State
    const [toast, setToast] = useState({
        isOpen: false,
        type: 'success',
        message: ''
    });

    // Additional Charges State
    const [additionalCharges, setAdditionalCharges] = useState({});
    const [activeChargesQuotation, setActiveChargesQuotation] = useState(null);

    // Print State
    const [printData, setPrintData] = useState(null);

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

    // Fetch all customers on mount
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                // TODO: Replace with actual API endpoint
                // const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/customers`);
                // setCustomers(response.data);

                // Mock data for now
                const mockCustomers = [
                    { id: 1, name: 'Alpha Corp' },
                    { id: 2, name: 'Beta Ltd' },
                    { id: 3, name: 'Gamma Inc' },
                    { id: 4, name: 'Delta LLC' },
                    { id: 5, name: 'Epsilon Group' }
                ];
                setCustomers(mockCustomers);
                setFilteredCustomers(mockCustomers);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        fetchCustomers();
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
            setFilteredCustomers(customers);
        } else {
            const filtered = customers.filter(customer =>
                customer.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredCustomers(filtered);
        }
    };

    const handleCustomerSelect = (customer) => {
        setSearchTerm(customer.name);
        setShowDropdown(false);
    };

    const handleSearchClick = async () => {
        if (!searchTerm) return;

        setLoading(true);
        try {
            // TODO: Replace with actual API endpoint
            // const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/quotations`, {
            //     params: { customerName: searchTerm }
            // });
            // setQuotations(response.data);

            // Mock data
            setTimeout(() => {
                setQuotations([
                    {
                        id: 1,
                        quotation_number: 'QTN-2025-001',
                        revision_number: 0,
                        customer_id: 1,
                        customer_name: searchTerm,
                        our_drawing_ref: 'DRW-001',
                        customer_drawing_ref: 'CUST-A1',
                        drawing_desc: 'Main Assembly',
                        contact_person_id: 1,
                        contact_person: 'John Doe',
                        enquiry_number: 'ENQ-001',
                        enquiry_date: '2025-01-15',
                        quotation_date: '2025-01-20',
                        valid_till: '2025-02-20',
                        currency_id: 1,
                        currency: 'USD',
                        status: 'Draft',
                        remark: 'Initial quotation',
                        line_count: 3, // Number of line items
                        created_by: 'Admin',
                        created_at: '2025-01-20T10:00:00'
                    },
                    {
                        id: 2,
                        quotation_number: 'QTN-2025-001',
                        revision_number: 1,
                        customer_id: 1,
                        customer_name: searchTerm,
                        our_drawing_ref: 'DRW-001-B',
                        customer_drawing_ref: 'CUST-A1-V2',
                        drawing_desc: 'Main Assembly Revised',
                        contact_person_id: 1,
                        contact_person: 'John Doe',
                        enquiry_number: 'ENQ-001',
                        enquiry_date: '2025-01-15',
                        quotation_date: '2025-01-25',
                        valid_till: '2025-02-25',
                        currency_id: 1,
                        currency: 'USD',
                        status: 'Approved',
                        remark: 'Revised after customer feedback',
                        line_count: 5,
                        revised_by: 'Admin',
                        revised_at: '2025-01-25T14:30:00',
                        created_by: 'Admin',
                        created_at: '2025-01-25T14:30:00'
                    }
                ]);
                setLoading(false);
            }, 500);

        } catch (error) {
            console.error('Error fetching quotations:', error);
            setLoading(false);
        }
    };

    const handleUpdateQuotation = async (updatedQuotation) => {
        try {
            // TODO: Replace with actual API endpoint
            // await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/quotations/${updatedQuotation.id}`, updatedQuotation);

            console.log('Updating quotation:', updatedQuotation);

            // Update local state
            setQuotations(prev => prev.map(item =>
                item.id === updatedQuotation.id ? updatedQuotation : item
            ));

            showStatus('success', 'Quotation updated successfully!');
        } catch (error) {
            console.error('Error updating quotation:', error);
            showStatus('error', 'Failed to update quotation.');
        }
    };

    const handleAddQuotation = () => {
        const newQuotation = {
            tempId: Date.now(),
            quotation_number: '',
            revision_number: 0,
            customer_id: '',
            customer_name: '',
            our_drawing_ref: '',
            customer_drawing_ref: '',
            drawing_desc: '',
            contact_person_id: '',
            contact_person: '',
            enquiry_number: '',
            enquiry_date: '',
            quotation_date: new Date().toISOString().split('T')[0],
            valid_till: '',
            currency_id: 1,
            currency: 'USD',
            status: 'Draft',
            remark: '',
            created_by: 'Admin'
        };
        setNewQuotations(prev => [newQuotation, ...prev]);
    };

    const handleNewQuotationChange = (tempId, field, value) => {
        setNewQuotations(prev => prev.map(quotation =>
            quotation.tempId === tempId ? { ...quotation, [field]: value } : quotation
        ));
    };

    const handleRemoveNewQuotation = (tempId) => {
        setNewQuotations(prev => prev.filter(quotation => quotation.tempId !== tempId));
    };

    const handleSaveAll = async () => {
        if (newQuotations.length === 0) return;

        // Validate required fields
        const invalidQuotations = newQuotations.filter(q =>
            !q.quotation_number?.trim() || !q.customer_name?.trim()
        );
        if (invalidQuotations.length > 0) {
            showStatus('warning', 'Please fill in Quotation Number and Customer Name for all new quotations.', 'Missing Information');
            return;
        }

        setSaving(true);
        try {
            // TODO: Replace with actual API endpoint
            // const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/quotations/bulk`, newQuotations);

            console.log('Saving new quotations:', newQuotations);

            // Mock success
            setTimeout(() => {
                const savedQuotations = newQuotations.map((quotation, index) => ({
                    ...quotation,
                    id: Date.now() + index,
                    line_count: 0,
                    created_at: new Date().toISOString()
                }));

                setQuotations(prev => [...savedQuotations, ...prev]);
                setNewQuotations([]);
                setSaving(false);
                showStatus('success', `${savedQuotations.length} quotation(s) saved successfully!`);
            }, 500);
        } catch (error) {
            console.error('Error saving quotations:', error);
            setSaving(false);
            showStatus('error', 'Failed to save quotations.');
        }
    };

    const handleViewLines = (quotation) => {
        setLineModal({
            isOpen: true,
            quotationId: quotation.id,
            quotationNumber: quotation.quotation_number,
            customerName: quotation.customer_name,
            status: quotation.status,
            revisionNumber: quotation.revision_number
        });
    };

    const handleCloseLineModal = () => {
        setLineModal({
            isOpen: false,
            quotationId: null,
            quotationNumber: '',
            customerName: '',
            status: '',
            revisionNumber: 0
        });
        if (searchTerm) {
            handleSearchClick();
        }
    };

    const handleOpenChargesModal = (quotation) => {
        setActiveChargesQuotation(quotation);
    };

    const handleSaveAdditionalCharges = (quotationId, chargesData) => {
        // chargesData will be { items: [], notApplicable: boolean }
        setAdditionalCharges(prev => ({
            ...prev,
            [quotationId]: chargesData
        }));

        if (chargesData.notApplicable) {
            showStatus('success', 'Marked as no additional charges applicable.');
        } else {
            showStatus('success', 'Additional charges added successfully.');
        }
    };

    const handlePrint = async (quotation) => {
        // Validation for Additional Charges - Check IMMEDIATELY
        const chargesData = additionalCharges[quotation.id];
        const hasCharges = chargesData?.items?.length > 0;
        const isNotApplicable = chargesData?.notApplicable;

        if (!hasCharges && !isNotApplicable) {
            showStatus('error', 'Additional charges are not added. Please add charges or mark as not applicable.', 'Action Required');
            return;
        }

        setLoading(true);
        try {
            // Fetch lines for this quotation (mimicking fetchLines from QuotationLineModal)
            // In a real app, this would be an API call
            // const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/quotation-lines/${quotation.id}`);
            // const lines = response.data;

            // Mocking the fetch
            await new Promise(resolve => setTimeout(resolve, 500));
            const mockLines = [
                {
                    id: 1,
                    line_number: 1,
                    drawing_description: 'Steel Plate Assembly',
                    drawing_number: 'DWG-001',
                    material_grade: 'SS304',
                    unit_price: 2000.00,
                    no_of_units: 5,
                    total_price: 10000.00
                },
                {
                    id: 2,
                    line_number: 2,
                    drawing_description: 'Bracket Component',
                    drawing_number: 'DWG-002',
                    material_grade: 'Mild Steel',
                    unit_price: 1100.00,
                    no_of_units: 10,
                    total_price: 11000.00
                }
            ];

            setPrintData({
                quotation,
                lines: mockLines,
                charges: chargesData?.items || []
            });
            setLoading(false);
        } catch (error) {
            console.error('Error preparing print data:', error);
            showStatus('error', 'Failed to prepare quotation for printing.');
            setLoading(false);
        }
    };

    return (
        <div className="quotation-master-wrapper">
            <div className="quotation-container">
                <div className="page-header">
                    <div className="header-icon-wrapper">
                        <FileText className="header-icon" size={32} />
                    </div>
                    <div>
                        <h2 className="page-title">Quotation Master</h2>
                        <p className="page-subtitle">Manage quotations and their line items</p>
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
                                    {filteredCustomers.length > 0 ? (
                                        filteredCustomers.map((customer) => (
                                            <div
                                                key={customer.id}
                                                className="dropdown-item"
                                                onClick={() => handleCustomerSelect(customer)}
                                            >
                                                <Building2 size={14} className="item-icon" />
                                                {customer.name}
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
                        <button className="btn-add-quotation" onClick={handleAddQuotation}>
                            <Plus size={18} />
                            <span>Add Quotation</span>
                        </button>
                        {newQuotations.length > 0 && (
                            <button className="btn-save-all" onClick={handleSaveAll} disabled={saving}>
                                {saving ? (
                                    <span className="loading-spinner"></span>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Save All ({newQuotations.length})</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {(newQuotations.length > 0 || quotations.length > 0) && (
                    <div className="results-section">
                        <QuotationTable
                            data={quotations}
                            newQuotations={newQuotations}
                            onUpdate={handleUpdateQuotation}
                            onNewQuotationChange={handleNewQuotationChange}
                            onRemoveNewQuotation={handleRemoveNewQuotation}
                            onViewLines={handleViewLines}
                            onOpenCharges={handleOpenChargesModal}
                            onPrint={handlePrint}
                            additionalCharges={additionalCharges}
                        />
                    </div>
                )}
            </div>

            {/* Line Items Modal */}
            {lineModal.isOpen && (
                <QuotationLineModal
                    isOpen={lineModal.isOpen}
                    onClose={handleCloseLineModal}
                    quotationId={lineModal.quotationId}
                    quotationNumber={lineModal.quotationNumber}
                    customerName={lineModal.customerName}
                    status={lineModal.status}
                    revisionNumber={lineModal.revisionNumber}
                />
            )}

            <Toast
                isOpen={toast.isOpen}
                onClose={closeToast}
                type={toast.type}
                message={toast.message}
            />

            {activeChargesQuotation && (
                <AdditionalChargesModal
                    isOpen={!!activeChargesQuotation}
                    onClose={() => setActiveChargesQuotation(null)}
                    quotation={activeChargesQuotation}
                    initialCharges={additionalCharges[activeChargesQuotation.id] || []}
                    onSave={handleSaveAdditionalCharges}
                    onShowToast={showStatus}
                />
            )}

            <QuotationPrintTemplate
                isOpen={!!printData}
                onClose={() => setPrintData(null)}
                quotation={printData?.quotation}
                lines={printData?.lines}
                additionalCharges={printData?.charges}
            />
        </div>
    );
};

export default QuotationMaster;
