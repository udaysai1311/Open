import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Pencil, Power, ShieldCheck, Mail, Building, Activity } from 'lucide-react';
import UserForm from './UserForm';
import Toast from '../Common/Toast/Toast';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [roles, setRoles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Mock Data Loading
    useEffect(() => {
        // Simulate API calls
        const loadData = () => {
            setDepartments([
                { department_id: 1, department_name: 'IT' },
                { department_id: 2, department_name: 'HR' },
                { department_id: 3, department_name: 'Sales' }
            ]);

            setRoles([
                { role_id: 1, role_name: 'Admin' },
                { role_id: 2, role_name: 'Manager' },
                { role_id: 3, role_name: 'Employee' }
            ]);

            // Generate more mock users for pagination testing
            const mockUsers = [
                {
                    user_id: 1,
                    user_code: 'IT001',
                    username: 'John Doe',
                    email: 'john@example.com',
                    department_id: 1,
                    is_active: true,
                    user_roles: [{ role_id: 1, can_read: true, can_write: true, can_delete: true }]
                },
                {
                    user_id: 2,
                    user_code: 'HR001',
                    username: 'Jane Smith',
                    email: 'jane@example.com',
                    department_id: 2,
                    is_active: true,
                    user_roles: [{ role_id: 2, can_read: true, can_write: true, can_delete: false }]
                }
            ];

            // Add some dummy users to test pagination
            const deptNames = ['IT', 'HR', 'SAL'];
            for (let i = 3; i <= 25; i++) {
                const deptId = (i % 3) + 1;
                const deptAbbr = deptNames[deptId - 1];
                const deptCount = Math.floor(i / 3) + 1;

                mockUsers.push({
                    user_id: i,
                    user_code: `${deptAbbr}${deptCount.toString().padStart(3, '0')}`,
                    username: `Employee ${i}`,
                    email: `user${i}@example.com`,
                    department_id: deptId,
                    is_active: i % 5 !== 0,
                    user_roles: [{ role_id: 3, can_read: true, can_write: false, can_delete: false }]
                });
            }

            setUsers(mockUsers);
        };

        loadData();
    }, []);

    const handleAddUser = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleSaveUser = (userData) => {
        // Simulate API Save
        console.log('Saving User Data:', userData);

        if (editingUser) {
            setUsers(prev => prev.map(u => u.user_id === editingUser.user_id ? { ...userData, user_id: u.user_id } : u));
            setToast({ isOpen: true, type: 'success', message: 'User updated successfully!' });
        } else {
            setUsers(prev => [...prev, { ...userData, user_id: Date.now() }]);
            setToast({ isOpen: true, type: 'success', message: 'User created successfully!' });
        }
        setIsModalOpen(false);
    };

    const handleToggleStatus = (user) => {
        const newStatus = !user.is_active;
        const action = newStatus ? 'activated' : 'deactivated';

        if (window.confirm(`Are you sure you want to ${action} this user?`)) {
            setUsers(prev => prev.map(u => u.user_id === user.user_id ? { ...u, is_active: newStatus } : u));
            setToast({ isOpen: true, type: 'success', message: `User ${action} successfully.` });
        }
    };

    const getDepartmentName = (id) => {
        const dept = departments.find(d => d.department_id == id);
        return dept ? dept.department_name : '-';
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="um-wrapper">
            <div className="um-page-header">
                <div className="um-header-icon-wrapper">
                    <Users className="um-header-icon" size={32} />
                </div>
                <div>
                    <h2 className="um-page-title">User Management</h2>
                    <p className="um-page-subtitle">Manage system users, roles, and access permissions</p>
                </div>
            </div>

            <div className="um-controls-section">
                <div className="um-search-wrapper">
                    <Search className="um-search-icon" size={18} />
                    <input
                        type="text"
                        className="um-search-input"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <button className="um-btn-add-user" onClick={handleAddUser}>
                    <Plus size={20} />
                    Add New User
                </button>
            </div>

            <div className="um-table-container">
                <div className="um-table-responsive">
                    <table className="um-user-table">
                        <thead>
                            <tr>
                                <th><div className="um-th-content"><Building size={16} /> User Code</div></th>
                                <th><div className="um-th-content"><Users size={16} /> Employee Name</div></th>
                                <th><div className="um-th-content"><Mail size={16} /> Email</div></th>
                                <th><div className="um-th-content"><Building size={16} /> Department</div></th>
                                <th><div className="um-th-content"><ShieldCheck size={16} /> Roles</div></th>
                                <th><div className="um-th-content"><Activity size={16} /> Status</div></th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map(user => (
                                <tr key={user.user_id}>
                                    <td>{user.user_code || '-'}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email || '-'}</td>
                                    <td>{getDepartmentName(user.department_id)}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {user.user_roles?.map((ur, idx) => {
                                                const role = roles.find(r => r.role_id == ur.role_id);
                                                return role ? (
                                                    <span key={idx} className="um-status-badge role">
                                                        {role.role_name}
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`um-status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="um-action-buttons">
                                            <button className="um-btn-icon edit" onClick={() => handleEditUser(user)} title="Edit">
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                className={`um-btn-icon toggle ${user.is_active ? 'active' : 'inactive'}`}
                                                onClick={() => handleToggleStatus(user)}
                                                title={user.is_active ? "Deactivate User" : "Activate User"}
                                            >
                                                <Power size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {currentUsers.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="um-pagination">
                        <button
                            className="um-pagination-btn"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>

                        <div className="um-pagination-numbers">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                <button
                                    key={number}
                                    className={`um-pagination-number ${currentPage === number ? 'active' : ''}`}
                                    onClick={() => handlePageChange(number)}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>

                        <button
                            className="um-pagination-btn"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            <UserForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveUser}
                initialData={editingUser}
                departments={departments}
                roles={roles}
            />

            <Toast
                isOpen={toast.isOpen}
                onClose={() => setToast(prev => ({ ...prev, isOpen: false }))}
                type={toast.type}
                message={toast.message}
            />
        </div>
    );
};

export default UserManagement;
