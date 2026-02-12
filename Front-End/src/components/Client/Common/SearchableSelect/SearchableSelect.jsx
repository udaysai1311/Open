import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import './SearchableSelect.css';

/**
 * Reusable Searchable Select Component
 */
const SearchableSelect = ({
    options = [],
    value,
    onChange,
    placeholder = "Select...",
    label,
    icon: Icon,
    error,
    valueKey = 'value',
    labelKey = 'label',
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const [selectedLabel, setSelectedLabel] = useState('');

    // Sync state with prop value
    useEffect(() => {
        if (value !== undefined && value !== null && value !== '') {
            const selectedOption = options.find(opt => opt[valueKey] === value);
            if (selectedOption) {
                const labelText = selectedOption[labelKey];
                setSelectedLabel(labelText);
                // If not open, sync search term to label to show selected value
                if (!isOpen) {
                    setSearchTerm(labelText);
                }
            } else {
                // Value exists but option doesn't (yet), show value
                setSelectedLabel(value.toString());
                if (!isOpen) {
                    setSearchTerm(value.toString());
                }
            }
        } else {
            setSelectedLabel('');
            if (!isOpen) {
                setSearchTerm('');
            }
        }
    }, [value, options, valueKey, labelKey, isOpen]);

    // Handle outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                // On close, reset search term to selected label
                // Check if we have a valid selection based on current value prop
                if (value) {
                    const selectedOption = options.find(opt => opt[valueKey] === value);
                    if (selectedOption) {
                        setSearchTerm(selectedOption[labelKey]);
                    } else {
                        setSearchTerm(value.toString());
                    }
                } else {
                    setSearchTerm('');
                }
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, value, options, valueKey, labelKey]);

    const filteredOptions = options.filter(option => {
        const optionLabel = option[labelKey] ? option[labelKey].toString() : '';
        return optionLabel.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        if (!isOpen) setIsOpen(true);
    };

    const handleSelect = (option) => {
        onChange(option[valueKey]);
        setSearchTerm(option[labelKey]);
        setIsOpen(false);
    };

    const handleInputFocus = () => {
        if (!disabled) {
            setIsOpen(true);
            // Optionally clear search term on focus to allow fresh search?
            // For now, let's keep it as is, or maybe select the text
            if (inputRef.current) {
                inputRef.current.select();
            }
        }
    };

    return (
        <div className="searchable-select-wrapper" ref={dropdownRef}>
            {label && (
                <label className="searchable-select-label">
                    {Icon && <Icon size={16} />}
                    {label}
                </label>
            )}

            <div className="searchable-input-container">
                <Search className="searchable-input-icon" size={18} />
                <input
                    ref={inputRef}
                    type="text"
                    className={`searchable-input ${error ? 'has-error' : ''}`}
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onClick={handleInputFocus}
                    disabled={disabled}
                />

                <ChevronDown
                    size={16}
                    className={`searchable-chevron ${isOpen ? 'rotate' : ''}`}
                    onClick={handleInputFocus} // Allow clicking chevron to open
                    style={{ position: 'absolute', right: '1rem', cursor: 'pointer', color: '#a0aec0', transition: 'transform 0.2s' }}
                />
            </div>

            {isOpen && !disabled && (
                <div className="searchable-dropdown">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <div
                                key={`${option[valueKey]}-${index}`}
                                className={`dropdown-item ${option[valueKey] === value ? 'selected' : ''}`}
                                onClick={() => handleSelect(option)}
                            >
                                {option[labelKey]}
                            </div>
                        ))
                    ) : (
                        <div className="dropdown-no-results">No results found</div>
                    )}
                </div>
            )}

            {error && <p className="searchable-error">{error}</p>}
        </div>
    );
};

export default SearchableSelect;
