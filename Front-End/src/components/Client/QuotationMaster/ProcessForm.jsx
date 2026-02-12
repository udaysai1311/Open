import React, { useState, useEffect, useMemo } from 'react';
import { Save, X, ArrowRight, CheckCircle } from 'lucide-react';
import excelStructure from '../../../data/excel_structure.json';
import SearchableSelect from '../Common/SearchableSelect/SearchableSelect';
import './ProcessDetailsList.css'; // Reusing/Adding styles here

const ProcessForm = ({ initialData, onSave, onCancel, isInline = false }) => {
    const [mainProcess, setMainProcess] = useState(initialData?.["Main Process"] || '');
    const [subCategory, setSubCategory] = useState(initialData?.["Sub Category"] || '');
    const [processName, setProcessName] = useState(initialData?.["Process"] || '');

    // Extract dynamic fields from initialData (excluding the 3 main keys)
    const [formData, setFormData] = useState(() => {
        if (!initialData) return {};
        const { "Main Process": mp, "Sub Category": sc, "Process": p, ...rest } = initialData;
        return rest;
    });

    const [errors, setErrors] = useState({});

    // Derive Main Process Options
    const mainProcessOptions = useMemo(() => {
        const processes = new Set(excelStructure.sampleRows.map(row => row["Main Process"]));
        return Array.from(processes).filter(Boolean).map(p => ({ label: p, value: p }));
    }, []);

    // Derive Sub Category Options
    const subCategoryOptions = useMemo(() => {
        if (!mainProcess) return [];
        const categories = new Set(
            excelStructure.sampleRows
                .filter(row => row["Main Process"] === mainProcess)
                .map(row => row["Sub Category"])
        );
        return Array.from(categories).filter(Boolean).map(c => ({ label: c, value: c }));
    }, [mainProcess]);

    // Derive Process Options
    const processOptions = useMemo(() => {
        if (!mainProcess || !subCategory) return [];
        const processes = new Set(
            excelStructure.sampleRows
                .filter(row => row["Main Process"] === mainProcess && row["Sub Category"] === subCategory)
                .map(row => row["Process"])
        );
        return Array.from(processes).filter(Boolean).map(p => ({ label: p, value: p }));
    }, [mainProcess, subCategory]);

    // Get the selected row template to determine dynamic fields
    const selectedRowTemplate = useMemo(() => {
        if (!mainProcess || !subCategory || !processName) return null;
        return excelStructure.sampleRows.find(row =>
            row["Main Process"] === mainProcess &&
            row["Sub Category"] === subCategory &&
            row["Process"] === processName
        );
    }, [mainProcess, subCategory, processName]);

    // Dynamic Fields (excluding the selector fields)
    const dynamicFields = useMemo(() => {
        if (!selectedRowTemplate) return [];
        const excludedKeys = ["Main Process", "Sub Category", "Process"];
        return Object.keys(selectedRowTemplate).filter(key => !excludedKeys.includes(key));
    }, [selectedRowTemplate]);

    // Handle Input Change
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    // Determining input type
    const getInputType = (fieldName) => {
        const lowerName = fieldName.toLowerCase();
        if (lowerName.includes('date')) return 'date';
        if (lowerName.includes('cost') || lowerName.includes('price') || lowerName.includes('qty') ||
            lowerName.includes('mm') || lowerName.includes('weight') || lowerName.includes('minutes') ||
            lowerName.includes('rate') || lowerName.includes('percent') || lowerName.includes('%')) {
            return 'number';
        }
        return 'text';
    };

    const handleSaveClick = () => {
        const newErrors = {};
        dynamicFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = 'Required';
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const result = {
            "Main Process": mainProcess,
            "Sub Category": subCategory,
            "Process": processName,
            ...formData
        };

        onSave(result);
    };

    return (
        <div className={`pf-container ${isInline ? 'inline-mode' : ''}`}>
            {!isInline && (
                <div className="pf-header">
                    <h4 className="pf-title">{initialData ? 'Edit Process' : 'New Process Details'}</h4>
                    <button className="pf-btn-close" onClick={onCancel}><X size={16} /></button>
                </div>
            )}

            <div className="pf-grid-selectors">
                <SearchableSelect
                    label="Main Process"
                    options={mainProcessOptions}
                    value={mainProcess}
                    onChange={(val) => {
                        setMainProcess(val);
                        setSubCategory('');
                        setProcessName('');
                    }}
                    placeholder="Select Main Process"
                />

                <SearchableSelect
                    label="Sub Category"
                    options={subCategoryOptions}
                    value={subCategory}
                    onChange={(val) => {
                        setSubCategory(val);
                        setProcessName('');
                    }}
                    disabled={!mainProcess}
                    placeholder="Select Sub Category"
                />

                <SearchableSelect
                    label="Process"
                    options={processOptions}
                    value={processName}
                    onChange={(val) => setProcessName(val)}
                    disabled={!subCategory}
                    placeholder="Select Process"
                />
            </div>

            {selectedRowTemplate ? (
                <div className="pf-dynamic-section">
                    <div className="pf-section-title">
                        <CheckCircle size={14} className="text-green" />
                        <span>Required Parameters</span>
                    </div>
                    <div className="pf-dynamic-grid">
                        {dynamicFields.map(field => (
                            <div key={field} className="pf-form-group">
                                <label>{field}</label>
                                <input
                                    type={getInputType(field)}
                                    value={formData[field] || ''}
                                    onChange={(e) => handleInputChange(field, e.target.value)}
                                    className={errors[field] ? 'pf-input-error' : ''}
                                    placeholder={selectedRowTemplate[field] === 'Required' ? '' : selectedRowTemplate[field]}
                                />
                                {errors[field] && <span className="pf-error-msg">{errors[field]}</span>}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                mainProcess && subCategory && (
                    <div className="pf-empty-state">
                        <ArrowRight size={20} className="pf-bounce" />
                        <span>Select a Process to view required fields</span>
                    </div>
                )
            )}

            <div className="pf-actions">
                <button className="pf-btn-cancel" onClick={onCancel}>Cancel</button>
                <button
                    className="pf-btn-save"
                    onClick={handleSaveClick}
                    disabled={!selectedRowTemplate}
                >
                    <Save size={16} />
                    {initialData ? 'Update Process' : 'Add Process'}
                </button>
            </div>
        </div>
    );
};

export default ProcessForm;
