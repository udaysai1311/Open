import React, { useState, useEffect } from 'react';
import { X, Plus, Save, AlertCircle, ChevronDown, ChevronUp, Trash2, Edit2, Check } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import SearchableSelect from '../Common/SearchableSelect/SearchableSelect';
import './QuotationLineModal.css';
import ProcessDetailsList from './ProcessDetailsList';


const QuotationLineModal = ({
    isOpen,
    onClose,
    quotationId,
    quotationNumber,
    customerName,
    status,
    revisionNumber
}) => {
    const [lines, setLines] = useState([]);
    const [newLines, setNewLines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [needsRevision, setNeedsRevision] = useState(false);

    // Material Grades - Temporary frontend data
    const [materialGrades] = useState([
        { id: 1, grade: 'SS304' },
        { id: 2, grade: 'SS316' },
        { id: 3, grade: 'MS' },
        { id: 4, grade: 'Mild Steel' },
        { id: 5, grade: 'Spring Steel' },
        { id: 6, grade: 'Aluminum' }
    ]);
    // For future backend integration:
    // const [materialGrades, setMaterialGrades] = useState([]);



    // Expanded rows and process details state
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [processDetails, setProcessDetails] = useState({});

    // Fetch line items when modal opens
    useEffect(() => {
        if (isOpen && quotationId) {
            fetchLines();
        }
    }, [isOpen, quotationId]);

    const fetchLines = async () => {
        setLoading(true);
        try {
            // TODO: Replace with actual API endpoint
            // const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/quotation-lines/${quotationId}`);
            // setLines(response.data);

            // Mock data
            setTimeout(() => {
                setLines([
                    {
                        id: 1,
                        quotation_id: quotationId,
                        line_number: 1,
                        drawing_description: 'Steel Plate Assembly',
                        drawing_number: 'DWG-001',
                        material_id: 1,
                        material_cost: 1500.00,
                        machinery_subcategory_total_cost: 500.00,
                        total_cost: 2000.00
                    },
                    {
                        id: 2,
                        quotation_id: quotationId,
                        line_number: 2,
                        drawing_description: 'Bracket Component',
                        drawing_number: 'DWG-002',
                        material_id: 3,
                        material_cost: 800.00,
                        machinery_subcategory_total_cost: 300.00,
                        total_cost: 1100.00
                    }
                ]);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('Error fetching lines:', error);
            setLoading(false);
        }
    };

    const handleAddLine = () => {
        const newLine = {
            tempId: Date.now(),
            line_number: lines.length + newLines.length + 1,
            drawing_ref_id: '',
            material_id: '',
            material_cost: '',
            mfg_cost: '',
            inspection_cost: '',
            testing_cost: '',
            special_process_cost: '',
            brought_out_items_cost: '',
            packing_shipping_cost: '',
            other_cost: '',
            unit_price: 0,
            no_of_units: 1,
            total_price: 0,
            isEditing: true
        };
        setNewLines(prev => [...prev, newLine]);
    };

    const calculateTotals = (line) => {
        const material = parseFloat(line.material_cost) || 0;
        const mfg = parseFloat(line.mfg_cost) || parseFloat(line.machinery_subcategory_total_cost) || 0;
        const inspection = parseFloat(line.inspection_cost) || 0;
        const testing = parseFloat(line.testing_cost) || 0;
        const special = parseFloat(line.special_process_cost) || 0;
        const broughtOut = parseFloat(line.brought_out_items_cost) || 0;
        const packing = parseFloat(line.packing_shipping_cost) || 0;
        const other = parseFloat(line.other_cost) || 0;

        // Correctly handle no_of_units parsing and default to 1 for existing items
        let noOfUnits = parseFloat(line.no_of_units);
        if (isNaN(noOfUnits)) {
            noOfUnits = line.id ? 1 : 0;
        }

        const unitPrice = material + mfg + inspection + testing + special + broughtOut + packing + other;
        const totalPrice = unitPrice * noOfUnits;

        return {
            ...line,
            mfg_cost: (line.mfg_cost || line.machinery_subcategory_total_cost) ? (line.mfg_cost || line.machinery_subcategory_total_cost) : '',
            unit_price: unitPrice,
            total_price: totalPrice,
            no_of_units: noOfUnits
        };
    };

    const handleNewLineChange = (tempId, field, value) => {
        setNewLines(prev => prev.map(line => {
            if (line.tempId === tempId) {
                const updatedLine = { ...line, [field]: value };
                return calculateTotals(updatedLine);
            }
            return line;
        }));
    };

    const handleLineChange = (id, field, value) => {
        setLines(prev => prev.map(line => {
            if (line.id === id) {
                const updatedLine = { ...line, [field]: value };
                return calculateTotals(updatedLine);
            }
            return line;
        }));
    };

    const handleRemoveLine = (id, isNew = false) => {
        if (isNew) {
            setNewLines(prev => prev.filter(line => line.tempId !== id));
        } else {
            setLines(prev => prev.filter(line => line.id !== id));
        }
    };

    const toggleLineRowEdit = (id, isNew = false) => {
        if (isNew) {
            setNewLines(prev => prev.map(line =>
                line.tempId === id ? { ...line, isEditing: !line.isEditing } : line
            ));
        } else {
            setLines(prev => prev.map(line =>
                line.id === id ? { ...line, isEditing: !line.isEditing } : line
            ));
        }
    };

    const handleSaveAll = async () => {
        if (newLines.length === 0) return;

        setSaving(true);
        try {
            // TODO: API call to save all new lines
            console.log('Saving new lines:', newLines);

            setTimeout(() => {
                const savedLines = newLines.map((line, index) => ({
                    ...line,
                    id: Date.now() + index,
                    quotation_id: quotationId
                }));

                setLines(prev => [...prev, ...savedLines]);
                setNewLines([]);
                setSaving(false);
            }, 500);
        } catch (error) {
            console.error('Error saving lines:', error);
            setSaving(false);
        }
    };



    // Toggle row expansion
    const toggleRowExpansion = (lineId) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(lineId)) {
            newExpanded.delete(lineId);
        } else {
            newExpanded.add(lineId);
            // Initialize process details for this line if not exists
            if (!processDetails[lineId]) {
                setProcessDetails(prev => ({
                    ...prev,
                    [lineId]: []
                }));
            }
        }
        setExpandedRows(newExpanded);
    };

    // Save Process (Add or Update)
    const handleSaveProcess = (lineId, processData) => {
        setProcessDetails(prev => {
            const currentRows = prev[lineId] || [];

            // Check if we are updating an existing row
            if (processData.tempId) {
                return {
                    ...prev,
                    [lineId]: currentRows.map(row =>
                        row.tempId === processData.tempId ? { ...processData, isEditing: false } : row
                    )
                };
            }

            // Create new row
            const newProcessRow = {
                tempId: Date.now(),
                ...processData,
                isEditing: false
            };

            return {
                ...prev,
                [lineId]: [...currentRows, newProcessRow]
            };
        });

        // Ensure row is expanded
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            newSet.add(lineId);
            return newSet;
        });
    };

    // Remove a process row
    const handleRemoveProcessRow = (lineId, tempId) => {
        setProcessDetails(prev => ({
            ...prev,
            [lineId]: prev[lineId].filter(row => row.tempId !== tempId)
        }));
    };

    // Update a process row field
    const handleProcessRowChange = (lineId, tempId, field, value) => {
        setProcessDetails(prev => ({
            ...prev,
            [lineId]: prev[lineId].map(row => {
                if (row.tempId === tempId) {
                    return { ...row, [field]: value };
                }
                return row;
            })
        }));
    };

    const toggleProcessRowEdit = (lineId, tempId) => {
        // Optional: Toggle edit mode if needed, or re-open modal
        // For now, keeping inline edit toggle but it might need adaptation for dynamic fields
        setProcessDetails(prev => ({
            ...prev,
            [lineId]: prev[lineId].map(row =>
                row.tempId === tempId ? { ...row, isEditing: !row.isEditing } : row
            )
        }));
    };

    const getMaterialGradeName = (id) => materialGrades.find(g => g.id === id)?.grade || '';

    const renderMainCell = (line, field, isNew, type = 'text', placeholder = '') => {
        const calculatedLine = calculateTotals(line);
        const value = (field === 'unit_price' || field === 'total_price' || field === 'no_of_units' || field === 'mfg_cost')
            ? calculatedLine[field]
            : line[field];
        const isEditing = line.isEditing;

        if (isEditing && field !== 'line_number' && field !== 'unit_price' && field !== 'total_price') {
            const isUnitsField = field === 'no_of_units';
            return (
                <input
                    type={type}
                    step={isUnitsField ? "1" : (type === 'number' ? "0.01" : undefined)}
                    min={type === 'number' ? "0" : undefined}
                    className="qm-form-control-sm"
                    value={value !== undefined && value !== null ? value : ''}
                    onChange={(e) => isNew
                        ? handleNewLineChange(line.tempId, field, e.target.value)
                        : handleLineChange(line.id, field, e.target.value)
                    }
                    placeholder={placeholder}
                />
            );
        }

        let displayVal = value;
        if (field === 'no_of_units') {
            const numValue = parseFloat(value);
            displayVal = (!isNaN(numValue)) ? Math.floor(numValue).toString() : '0';
        } else if (type === 'number' || field === 'unit_price' || field === 'total_price') {
            const numValue = parseFloat(value);
            displayVal = (!isNaN(numValue)) ? numValue.toFixed(2) : '0.00';
        }

        return <span className="qm-process-text" style={{ paddingLeft: '0.5rem' }}>{displayVal}</span>;
    };

    if (!isOpen) return null;

    return (
        <div className="qm-modal-overlay" onClick={onClose}>
            <div className="qm-modal-drawer" onClick={e => e.stopPropagation()}>
                <div className="qm-modal-header">
                    <div>
                        <h3 className="qm-modal-title">Quotation Line Items</h3>
                        <div className="qm-modal-subtitle">
                            <span className="qm-quotation-info">
                                <strong>{quotationNumber}</strong> (Rev {revisionNumber}) - {customerName}
                            </span>
                            <span className={`qm-status-badge ${status.toLowerCase().replace(' ', '-')}`}>
                                {status}
                            </span>
                        </div>
                    </div>
                    <button className="qm-modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {needsRevision && (
                    <div className="qm-revision-warning">
                        <AlertCircle size={20} />
                        <span>
                            This quotation is {status}. Saving changes will create a new revision (Rev {revisionNumber + 1}).
                        </span>
                    </div>
                )}



                <div className="qm-modal-body">
                    {loading ? (
                        <div className="qm-loading-container">
                            <span className="qm-loading-spinner large"></span>
                            <p>Loading line items...</p>
                        </div>
                    ) : (
                        <div className="qm-table-wrapper">
                            <table className="qm-line-table">
                                <thead>
                                    <tr className="qm-blue-header-lines">
                                        <th>Line #</th>

                                        <th>Material Grade</th>
                                        <th>Material Cost</th>
                                        <th>MFG Cost</th>
                                        <th>Inspection Cost</th>
                                        <th>Testing Cost</th>
                                        <th>Special Process Cost</th>
                                        <th>Brought Out Items</th>
                                        <th>Packing & Shipping Cost</th>
                                        <th>Other Cost</th>
                                        <th>Unit Price</th>
                                        <th>No of Units</th>
                                        <th>Total Price</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* New Lines */}
                                    {newLines.map((line) => (
                                        <React.Fragment key={line.tempId}>
                                            <tr className="qm-new-line-row">
                                                <td>{renderMainCell(line, 'line_number', true, 'text')}</td>

                                                <td>
                                                    {line.isEditing ? (
                                                        <SearchableSelect
                                                            options={materialGrades}
                                                            value={line.material_id}
                                                            onChange={(value) => handleNewLineChange(line.tempId, 'material_id', value)}
                                                            placeholder="Select Grade"
                                                            valueKey="id"
                                                            labelKey="grade"
                                                            disabled={false} // True in new line context
                                                        />
                                                    ) : (
                                                        <span className="qm-process-text" style={{ paddingLeft: '0.5rem' }}>
                                                            {getMaterialGradeName(line.material_id)}
                                                        </span>
                                                    )}
                                                </td>
                                                <td>{renderMainCell(line, 'material_cost', true, 'number', '0.00')}</td>
                                                <td>{renderMainCell(line, 'mfg_cost', true, 'number', '0.00')}</td>
                                                <td>{renderMainCell(line, 'inspection_cost', true, 'number', '0.00')}</td>
                                                <td>{renderMainCell(line, 'testing_cost', true, 'number', '0.00')}</td>
                                                <td>{renderMainCell(line, 'special_process_cost', true, 'number', '0.00')}</td>
                                                <td>{renderMainCell(line, 'brought_out_items_cost', true, 'number', '0.00')}</td>
                                                <td>{renderMainCell(line, 'packing_shipping_cost', true, 'number', '0.00')}</td>
                                                <td>{renderMainCell(line, 'other_cost', true, 'number', '0.00')}</td>
                                                <td>{renderMainCell(line, 'unit_price', true, 'number', '0.00')}</td>
                                                <td>{renderMainCell(line, 'no_of_units', true, 'number', '0')}</td>
                                                <td>{renderMainCell(line, 'total_price', true, 'number', '0.00')}</td>
                                                <td>
                                                    <div className="qm-process-actions">
                                                        {line.isEditing ? (
                                                            <button className="qm-btn-action save" onClick={() => toggleLineRowEdit(line.tempId, true)} title="Save"><Check size={16} /></button>
                                                        ) : (
                                                            <button className="qm-btn-action" onClick={() => toggleLineRowEdit(line.tempId, true)} title="Edit"><Edit2 size={16} /></button>
                                                        )}
                                                        <button className="qm-btn-action" onClick={() => toggleRowExpansion(`new-${line.tempId}`)} title="View Processes">
                                                            {expandedRows.has(`new-${line.tempId}`) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                        </button>
                                                        <button className="qm-btn-action delete" onClick={() => handleRemoveLine(line.tempId, true)} title="Delete"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Process Details Row */}
                                            {expandedRows.has(`new-${line.tempId}`) && (
                                                <tr className="qm-process-details-row">
                                                    <td colSpan="14">
                                                        <ProcessDetailsList
                                                            rows={processDetails[`new-${line.tempId}`] || []}
                                                            onSaveProcess={(data) => handleSaveProcess(`new-${line.tempId}`, data)}
                                                            onRemoveRow={(rowId) => handleRemoveProcessRow(`new-${line.tempId}`, rowId)}
                                                            lineItem={{
                                                                line_number: line.line_number,
                                                                material_grade: getMaterialGradeName(line.material_grade)
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}

                                    {/* Existing Lines */}
                                    {lines.map((line) => (
                                        <React.Fragment key={line.id}>
                                            <tr>
                                                <td>{renderMainCell(line, 'line_number', false, 'text')}</td>

                                                <td>
                                                    <span className="qm-process-text" style={{ paddingLeft: '0.5rem' }}>
                                                        {getMaterialGradeName(line.material_id) || line.material_grade}
                                                    </span>
                                                </td>
                                                <td>{renderMainCell(line, 'material_cost', false, 'number', '0.00')}</td>
                                                <td>{renderMainCell(line, 'mfg_cost', false, 'number', '0.00')}</td>
                                                <td>{renderMainCell(line, 'inspection_cost', false, 'number', '0.00')}</td>
                                                <td>{renderMainCell(line, 'testing_cost', false, 'number', '0.00')}</td>
                                                <td>{renderMainCell(line, 'special_process_cost', false, 'number', '0.00')}</td>
                                                <td>{renderMainCell(line, 'brought_out_items_cost', false, 'number', '0.00')}</td>
                                                <td>{renderMainCell(line, 'packing_shipping_cost', false, 'number', '0.00')}</td>
                                                <td>{renderMainCell(line, 'other_cost', false, 'number', '0.00')}</td>
                                                <td>{renderMainCell(line, 'unit_price', false, 'number', '0.00')}</td>
                                                <td>{renderMainCell(line, 'no_of_units', false, 'number', '0')}</td>
                                                <td>{renderMainCell(line, 'total_price', false, 'number', '0.00')}</td>
                                                <td>
                                                    <div className="qm-process-actions">
                                                        {line.isEditing ? (
                                                            <button className="qm-btn-action save" onClick={() => toggleLineRowEdit(line.id, false)} title="Save"><Check size={16} /></button>
                                                        ) : (
                                                            <button className="qm-btn-action" onClick={() => toggleLineRowEdit(line.id, false)} title="Edit"><Edit2 size={16} /></button>
                                                        )}
                                                        <button className="qm-btn-action" onClick={() => toggleRowExpansion(line.id)} title="View Processes">
                                                            {expandedRows.has(line.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                        </button>
                                                        <button className="qm-btn-action delete" onClick={() => handleRemoveLine(line.id, false)} title="Delete"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Process Details Row */}
                                            {expandedRows.has(line.id) && (
                                                <tr className="qm-process-details-row">
                                                    <td colSpan="14">
                                                        <ProcessDetailsList
                                                            rows={processDetails[line.id] || []}
                                                            onSaveProcess={(data) => handleSaveProcess(line.id, data)}
                                                            onRemoveRow={(rowId) => handleRemoveProcessRow(line.id, rowId)}
                                                            lineItem={{
                                                                line_number: line.line_number,
                                                                material_grade: getMaterialGradeName(line.material_id) || line.material_grade
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>

                            {lines.length === 0 && newLines.length === 0 && (
                                <div className="qm-empty-state">
                                    <p>No line items yet. Click "Add Line Item" to get started.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="qm-modal-footer">
                    <div className="qm-modal-actions">
                        <button className="qm-btn-add-line" onClick={handleAddLine}><Plus size={18} /><span>Add Line Item</span></button>
                        {newLines.length > 0 && (
                            <button className="qm-btn-save-all" onClick={handleSaveAll} disabled={saving}>
                                {saving ? (
                                    <span className="qm-loading-spinner"></span>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Save All Lines ({newLines.length})</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* <button className="qm-btn-secondary" onClick={onClose}>
                        Close
                    </button> */}
                </div>
            </div>


        </div>
    );
};

export default QuotationLineModal;
