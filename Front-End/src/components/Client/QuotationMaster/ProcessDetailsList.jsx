import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight, ChevronRight as ChevronRightIcon, Edit2, Settings } from 'lucide-react';
import ProcessForm from './ProcessForm';
import './ProcessDetailsList.css';

const ProcessDetailsList = (props) => {
    const { rows = [], onSaveProcess, onRemoveRow } = props;
    // Track expanded cards
    const [expandedCards, setExpandedCards] = useState(new Set());

    // UI States
    const [addFormKey, setAddFormKey] = useState(0);
    const [isAdding, setIsAdding] = useState(true);
    const [editingId, setEditingId] = useState(null);

    const handleAddButtonClick = () => {
        setIsAdding(true);
        setEditingId(null);
    };

    const toggleCard = (tempId) => {
        if (editingId === tempId) return; // Don't toggle if editing
        setExpandedCards(prev => {
            const next = new Set(prev);
            if (next.has(tempId)) {
                next.delete(tempId);
            } else {
                next.add(tempId);
            }
            return next;
        });
    };

    const handleSave = (data) => {
        if (editingId) {
            // Update existing row
            onSaveProcess({ ...data, tempId: editingId });
            setEditingId(null);
        } else {
            // Add new row
            onSaveProcess(data);
            setIsAdding(false); // Hide the form after save as requested
            setAddFormKey(prev => prev + 1); // Reset the "Add" form
        }
    };

    const handleCancel = () => {
        if (editingId) {
            setEditingId(null);
        } else {
            setIsAdding(false); // Hide the form on cancel
            setAddFormKey(prev => prev + 1);
        }
    };

    const getDynamicFields = (row) => {
        const fixedKeys = ['tempId', 'id', 'isEditing', 'Main Process', 'Sub Category', 'Process'];
        return Object.entries(row).filter(([key]) => !fixedKeys.includes(key));
    };

    return (
        <div className="pdl-container">
            {/* Header Section */}
            <div className="pdl-header-section">
                <div className="pdl-header-left">
                    <div className="pdl-icon-wrapper">
                        <div className="pdl-icon-box">
                            <Settings size={20} color="white" />
                        </div>
                    </div>
                    <div className="pdl-title-wrapper">
                        <h4 className="pdl-main-title">Process Details</h4>
                        {props.lineItem && (
                            <p className="pdl-subtitle">
                                For Line Item #{props.lineItem.line_number} - {props.lineItem.material_grade}
                            </p>
                        )}
                    </div>
                </div>

                {!isAdding && !editingId && (
                    <button className="pdl-btn-add-header" onClick={handleAddButtonClick}>
                        <Plus size={18} />
                        <span>Add Process</span>
                    </button>
                )}
            </div>

            <div className="pdl-content">
                {/* Show the Add Form if isAdding is true */}
                {isAdding && (
                    <div className="pdl-form-section">
                        <ProcessForm
                            key={addFormKey}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            isInline={true}
                        />
                    </div>
                )}

                {/* List of existing processes */}
                <div className="pdl-list">
                    {rows.map((row) => (
                        <React.Fragment key={row.tempId}>
                            {editingId === row.tempId ? (
                                <div className="pdl-form-wrapper">
                                    <ProcessForm
                                        initialData={row}
                                        onSave={handleSave}
                                        onCancel={handleCancel}
                                    />
                                </div>
                            ) : (
                                <div
                                    className={`pdl-card ${expandedCards.has(row.tempId) ? 'expanded' : ''}`}
                                >
                                    <div
                                        className="pdl-card-header"
                                        onClick={() => toggleCard(row.tempId)}
                                    >
                                        <div className="pdl-card-title">
                                            <div className="pdl-process-info-row">
                                                <span className="pdl-path-text">{row['Main Process']}</span>
                                                <ChevronRightIcon size={14} className="pdl-separator" />
                                                <span className="pdl-path-text">{row['Sub Category']}</span>
                                                <ChevronRightIcon size={14} className="pdl-separator" />
                                                <span className="pdl-process-name-bold">{row['Process']}</span>
                                            </div>
                                        </div>

                                        <div className="pdl-card-actions">
                                            <button
                                                className="pdl-btn-icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingId(row.tempId);
                                                    setIsAdding(false);
                                                }}
                                                title="Edit Process"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="pdl-btn-icon" title={expandedCards.has(row.tempId) ? "Collapse" : "Expand"}>
                                                {expandedCards.has(row.tempId) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                            </button>
                                            <button
                                                className="pdl-btn-icon delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onRemoveRow(row.tempId);
                                                }}
                                                title="Delete Process"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {expandedCards.has(row.tempId) && (
                                        <div className="pdl-card-body">
                                            <div className="pdl-details-grid">
                                                {getDynamicFields(row).map(([key, value]) => (
                                                    <div key={key} className="pdl-detail-item">
                                                        <span className="pdl-label">{key}</span>
                                                        <span className="pdl-value">{value || '-'}</span>
                                                    </div>
                                                ))}
                                                {getDynamicFields(row).length === 0 && (
                                                    <div style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.875rem' }}>
                                                        No additional parameters
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default ProcessDetailsList;
