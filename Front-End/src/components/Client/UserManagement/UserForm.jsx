import React, { useEffect, useRef } from 'react';
import { X, Plus, Trash2, Shield, Building, ChevronDown, Search } from 'lucide-react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation Schema
const schema = yup.object().shape({
    department_id: yup.string().required('Department is required'),
    username: yup.string().required('Employee Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().when('isNewUser', {
        is: true,
        then: (schema) => schema.required('Password is required'),
        otherwise: (schema) => schema.optional()
    }),
    user_roles: yup.array().of(
        yup.object().shape({
            role_id: yup.string().required('Role is required'),
            can_read: yup.boolean(),
            can_write: yup.boolean(),
            can_delete: yup.boolean()
        })
    )
});

const CustomDropdown = ({ options, value, onChange, placeholder, icon: Icon, labelKey = 'label', valueKey = 'value', error }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
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

    const selectedOption = options.find(opt => opt[valueKey] == value);

    const filteredOptions = options.filter(opt =>
        opt[labelKey].toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="um-custom-dropdown" ref={dropdownRef}>
            <div
                className="um-dropdown-trigger"
                onClick={() => setIsOpen(!isOpen)}
                style={error ? { borderColor: '#e53e3e' } : {}}
            >
                {Icon && <Icon className="um-dropdown-icon" size={18} />}
                <span className={`um-dropdown-text ${!selectedOption ? 'um-placeholder' : ''}`}>
                    {selectedOption ? selectedOption[labelKey] : placeholder}
                </span>
                <ChevronDown className={`um-dropdown-arrow ${isOpen ? 'open' : ''}`} size={16} />
            </div>

            {isOpen && (
                <div className="um-dropdown-menu">
                    <div className="um-dropdown-search">
                        <Search size={14} className="um-search-icon-small" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    </div>
                    <div className="um-dropdown-list">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option[valueKey]}
                                    className={`um-dropdown-item ${option[valueKey] == value ? 'selected' : ''}`}
                                    onClick={() => {
                                        onChange(option[valueKey]);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                >
                                    {Icon && <Icon size={16} className="um-item-icon" />}
                                    {option[labelKey]}
                                </div>
                            ))
                        ) : (
                            <div className="um-dropdown-no-results">No results found</div>
                        )}
                    </div>
                </div>
            )}
            {error && <span className="um-error-message" style={{ color: '#e53e3e', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{error.message}</span>}
        </div>
    );
};

const UserForm = ({ isOpen, onClose, onSave, initialData, departments, roles }) => {
    const { register, control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            user_code: '',
            username: '',
            email: '',
            password: '',
            client_id: 1,
            department_id: '',
            team_lead: 0,
            is_active: true,
            user_roles: [],
            isNewUser: true
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "user_roles"
    });

    const selectedDeptId = watch('department_id');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({
                    ...initialData,
                    password: '',
                    isNewUser: false
                });
            } else {
                reset({
                    user_code: '',
                    username: '',
                    email: '',
                    password: '',
                    client_id: 1,
                    department_id: '',
                    team_lead: 0,
                    is_active: true,
                    user_roles: [],
                    isNewUser: true
                });
            }
        }
    }, [initialData, isOpen, reset]);

    // Fetch next user code when department changes (only for new users)
    useEffect(() => {
        if (!initialData && selectedDeptId) {
            const fetchNextUserCode = async () => {
                try {
                    const dept = departments.find(d => d.department_id == selectedDeptId);
                    if (dept) {
                        // Mock: Generate next ID
                        const deptAbbr = dept.department_name.substring(0, 3).toUpperCase();
                        const mockNextId = Math.floor(Math.random() * 1000) + 1;
                        const userCode = `${deptAbbr}${mockNextId.toString().padStart(3, '0')}`;
                        setValue('user_code', userCode);
                    }
                } catch (error) {
                    console.error('Error fetching next user code:', error);
                }
            };
            fetchNextUserCode();
        }
    }, [selectedDeptId, initialData, departments, setValue]);

    const onSubmit = (data) => {
        // Remove helper field before saving
        const { isNewUser, ...submitData } = data;
        onSave(submitData);
    };

    if (!isOpen) return null;

    return (
        <div className="um-modal-overlay" onClick={onClose}>
            <div className="um-modal-drawer" onClick={e => e.stopPropagation()}>
                <div className="um-modal-header">
                    <h3 className="um-modal-title">
                        {initialData ? 'Edit User' : 'Add New User'}
                    </h3>
                    <button className="um-modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="um-modal-body">
                    <form id="userForm" onSubmit={handleSubmit(onSubmit)}>
                        {/* Department - First Field */}
                        <div className="um-form-group">
                            <label className="um-form-label">Department <span className="um-required">*</span></label>
                            <Controller
                                name="department_id"
                                control={control}
                                render={({ field }) => (
                                    <CustomDropdown
                                        options={departments}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Select Department"
                                        icon={Building}
                                        labelKey="department_name"
                                        valueKey="department_id"
                                        error={errors.department_id}
                                    />
                                )}
                            />
                        </div>

                        {/* User Code - Second Field (Disabled) */}
                        <div className="um-form-group">
                            <label className="um-form-label">User Code</label>
                            <input
                                type="text"
                                className="um-form-input"
                                {...register('user_code')}
                                disabled
                                placeholder="Select department to generate code"
                                style={{ backgroundColor: '#f7fafc', cursor: 'not-allowed' }}
                            />
                        </div>

                        <div className="um-form-row">
                            <div className="um-form-group">
                                <label className="um-form-label">Employee Name <span className="um-required">*</span></label>
                                <input
                                    type="text"
                                    className={`um-form-input ${errors.username ? 'error' : ''}`}
                                    {...register('username')}
                                />
                                {errors.username && <span className="um-error-message" style={{ color: '#e53e3e', fontSize: '0.8rem' }}>{errors.username.message}</span>}
                            </div>
                            <div className="um-form-group">
                                <label className="um-form-label">Email <span className="um-required">*</span></label>
                                <input
                                    type="email"
                                    className={`um-form-input ${errors.email ? 'error' : ''}`}
                                    {...register('email')}
                                />
                                {errors.email && <span className="um-error-message" style={{ color: '#e53e3e', fontSize: '0.8rem' }}>{errors.email.message}</span>}
                            </div>
                        </div>

                        <div className="um-form-row">
                            <div className="um-form-group">
                                <label className="um-form-label">
                                    {initialData ? 'New Password (leave blank to keep)' : 'Password'}
                                    {!initialData && <span className="um-required">*</span>}
                                </label>
                                <input
                                    type="password"
                                    className={`um-form-input ${errors.password ? 'error' : ''}`}
                                    {...register('password')}
                                />
                                {errors.password && <span className="um-error-message" style={{ color: '#e53e3e', fontSize: '0.8rem' }}>{errors.password.message}</span>}
                            </div>
                            <div className="um-form-group">
                                <label className="um-form-label">
                                    <input
                                        type="checkbox"
                                        {...register('is_active')}
                                        style={{ marginRight: '0.5rem' }}
                                    />
                                    Active User
                                </label>
                            </div>
                        </div>

                        {/* Role Assignment Section */}
                        <div className="um-role-section">
                            <div className="um-role-section-title">
                                <Shield size={20} />
                                Role Assignments & Access
                            </div>

                            {fields.map((field, index) => (
                                <div key={field.id} className="um-role-card">
                                    <div className="um-role-header">
                                        <div style={{ flex: 1, marginRight: '1rem' }}>
                                            <Controller
                                                name={`user_roles.${index}.role_id`}
                                                control={control}
                                                render={({ field: roleField }) => (
                                                    <CustomDropdown
                                                        options={roles}
                                                        value={roleField.value}
                                                        onChange={roleField.onChange}
                                                        placeholder="Select Role"
                                                        icon={Shield}
                                                        labelKey="role_name"
                                                        valueKey="role_id"
                                                        error={errors.user_roles?.[index]?.role_id}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="um-btn-icon delete"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="um-access-grid">
                                        <label className="um-access-checkbox">
                                            <input
                                                type="checkbox"
                                                {...register(`user_roles.${index}.can_read`)}
                                            />
                                            Read
                                        </label>
                                        <label className="um-access-checkbox">
                                            <input
                                                type="checkbox"
                                                {...register(`user_roles.${index}.can_write`)}
                                            />
                                            Write
                                        </label>
                                        <label className="um-access-checkbox">
                                            <input
                                                type="checkbox"
                                                {...register(`user_roles.${index}.can_delete`)}
                                            />
                                            Delete
                                        </label>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                className="um-btn-add-role"
                                onClick={() => append({ role_id: '', can_read: false, can_write: false, can_delete: false })}
                            >
                                <Plus size={18} />
                                Assign New Role
                            </button>
                        </div>
                    </form>
                </div>

                <div className="um-modal-footer">
                    <button type="button" className="um-btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" form="userForm" className="um-btn-primary">
                        {initialData ? 'Update User' : 'Create User'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserForm;
