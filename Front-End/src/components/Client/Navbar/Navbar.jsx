import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Users, LayoutDashboard, LogOut, Settings, Logs, Database, Wrench, ChevronDown, DollarSign, FileText, Calculator } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [masterDataOpen, setMasterDataOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => setIsOpen(!isOpen);
    const toggleMasterData = () => setMasterDataOpen(!masterDataOpen);

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/customer_registration', icon: Users, label: 'Customer Registration' },
        { path: '/quotation-master', icon: FileText, label: 'Quotation Master' },
        { path: '/users', icon: Users, label: 'User Management' },
        { path: '/metal-weight-calculator', icon: Calculator, label: 'Metal Weight Calculator' },
        // { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    const masterDataItems = [
        { path: '/materials', icon: Database, label: 'Materials' },
        { path: '/machinery', icon: Wrench, label: 'Machinery' },
        // { path: '/process_pricing', icon: DollarSign, label: 'Process Pricing' },
    ];

    const isMasterDataActive = masterDataItems.some(item => location.pathname === item.path);

    return (
        <nav className="premium-sidebar">
            <div className="sidebar-header">
                <Logs size={24} />
                {/* <span className="app-name">Menu</span> */}
            </div>

            <div className="sidebar-nav">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={20} className="nav-icon" />
                            <span className="nav-text">{item.label}</span>
                        </Link>
                    );
                })}

                {/* Master Data Menu with Submenu */}
                <div className="nav-item-group">
                    <div
                        className={`nav-item nav-item-parent ${isMasterDataActive ? 'active' : ''} ${masterDataOpen ? 'open' : ''}`}
                        onClick={toggleMasterData}
                    >
                        <Database size={20} className="nav-icon" />
                        <span className="nav-text">Material Master</span>
                        <ChevronDown size={16} className={`nav-chevron ${masterDataOpen ? 'rotated' : ''}`} />
                    </div>

                    <div className={`nav-submenu ${masterDataOpen ? 'open' : ''}`}>
                        {masterDataItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`nav-subitem ${isActive ? 'active' : ''}`}
                                >
                                    <Icon size={18} className="nav-icon" />
                                    <span className="nav-text">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="user-avatar">JD</div>
                    <div className="user-info">
                        <div className="user-name">John Doe</div>
                        <div className="user-role">Administrator</div>
                    </div>
                </div>
                <button className="logout-btn">
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
