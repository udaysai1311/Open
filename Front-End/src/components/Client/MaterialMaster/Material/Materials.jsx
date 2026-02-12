import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
// import Loader from '../../Common/Loader/Loader';
import { Trash2, Edit, Plus, Save, X, Database, Layers, Link2, Weight, AlertCircle, FileText, Scale, DollarSign, ArrowUp, Box } from 'lucide-react';
import SearchableSelect from '../../Common/SearchableSelect/SearchableSelect';
import './Materials.css';

// --- Validation Schemas ---
const materialSchema = yup.object().shape({
    material_name: yup.string().required('Material Name is required'),
    material_grade: yup.string().required('Material Grade is required'),
    Density: yup.string(),
    unit: yup.string(),
    current_price: yup.number().typeError('Price must be a number').positive('Price must be positive'),
    description: yup.string(),
    remark: yup.string(),
});

const typeSchema = yup.object().shape({
    type_name: yup.string().required('Type Name is required'),
    description: yup.string(),
    remark: yup.string(),
});

const linkSchema = yup.object().shape({
    material_id: yup.string().required('Material is required'),
    material_type_id: yup.string().required('Material Type is required'),
    current_price: yup.number().typeError('Price must be a number').positive('Price must be positive'),
    remark: yup.string(),
});

const Materials = () => {
    const [activeTab, setActiveTab] = useState('master');
    const [loading, setLoading] = useState(false);

    // Data States
    const [materials, setMaterials] = useState([]);
    const [types, setTypes] = useState([]);
    const [links, setLinks] = useState([]);

    // Edit States
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [editingType, setEditingType] = useState(null);
    const [editingLink, setEditingLink] = useState(null);

    // Forms
    const materialForm = useForm({ resolver: yupResolver(materialSchema) });
    const typeForm = useForm({ resolver: yupResolver(typeSchema) });
    const linkForm = useForm({ resolver: yupResolver(linkSchema) });

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            const [matRes, typeRes, linkRes] = await Promise.all([
                axios.get(import.meta.env.VITE_MATERIAL_ALL_API_URL),
                axios.get(import.meta.env.VITE_MATERIAL_TYPE_ALL_API_URL),
                axios.get(import.meta.env.VITE_MATERIAL_TYPE_LINK_ALL_API_URL)
            ]);
            setMaterials(Array.isArray(matRes.data) ? matRes.data : []);
            setTypes(Array.isArray(typeRes.data) ? typeRes.data : []);
            setLinks(Array.isArray(linkRes.data) ? linkRes.data : []);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Handlers for Material Master ---
    const onMaterialSubmit = async (data) => {
        setLoading(true);
        try {
            if (editingMaterial) {
                await axios.put(import.meta.env.VITE_MATERIAL_UPDATE_API_URL.replace('{id}', editingMaterial.id), data);
            } else {
                await axios.post(import.meta.env.VITE_MATERIAL_SAVE_API_URL, data);
            }
            materialForm.reset();
            setEditingMaterial(null);
            fetchData();
        } catch (error) {
            console.error("Error saving material", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteMaterial = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        setLoading(true);
        try {
            await axios.delete(import.meta.env.VITE_MATERIAL_DELETE_API_URL.replace('{id}', id));
            fetchData();
        } catch (error) {
            console.error("Error deleting material", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Handlers for Material Type ---
    const onTypeSubmit = async (data) => {
        setLoading(true);
        try {
            if (editingType) {
                await axios.put(import.meta.env.VITE_MATERIAL_TYPE_UPDATE_API_URL.replace('{id}', editingType.id), data);
            } else {
                await axios.post(import.meta.env.VITE_MATERIAL_TYPE_SAVE_API_URL, data);
            }
            typeForm.reset();
            setEditingType(null);
            fetchData();
        } catch (error) {
            console.error("Error saving type", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteType = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        setLoading(true);
        try {
            await axios.delete(import.meta.env.VITE_MATERIAL_TYPE_DELETE_API_URL.replace('{id}', id));
            fetchData();
        } catch (error) {
            console.error("Error deleting type", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Handlers for Linking ---
    const onLinkSubmit = async (data) => {
        setLoading(true);
        try {
            if (editingLink) {
                await axios.put(import.meta.env.VITE_MATERIAL_TYPE_LINK_UPDATE_API_URL.replace('{id}', editingLink.id), data);
            } else {
                await axios.post(import.meta.env.VITE_MATERIAL_TYPE_LINK_SAVE_API_URL, data);
            }
            linkForm.reset();
            setEditingLink(null);
            fetchData();
        } catch (error) {
            console.error("Error saving link", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteLink = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        setLoading(true);
        try {
            await axios.delete(import.meta.env.VITE_MATERIAL_TYPE_LINK_DELETE_API_URL.replace('{id}', id));
            fetchData();
        } catch (error) {
            console.error("Error deleting link", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="materials-wrapper">
            {/* <Loader visible={loading} /> */}

            <div className="materials-container">
                <div className="page-header">
                    <div className="header-icon-wrapper">
                        <Database size={28} />
                    </div>
                    <div>
                        <h1 className="page-title">Material Management</h1>
                        <p className="page-subtitle">Manage materials, types, and their relationships</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs-container">
                    <button
                        onClick={() => setActiveTab('master')}
                        className={`tab-btn ${activeTab === 'master' ? 'active' : ''}`}
                    >
                        <Database size={18} /> Material Master
                    </button>
                    <button
                        onClick={() => setActiveTab('type')}
                        className={`tab-btn ${activeTab === 'type' ? 'active' : ''}`}
                    >
                        <Layers size={18} /> Material Types
                    </button>
                    <button
                        onClick={() => setActiveTab('link')}
                        className={`tab-btn ${activeTab === 'link' ? 'active' : ''}`}
                    >
                        <Link2 size={18} /> Material Type Linking
                    </button>
                </div>

                {/* Material Master Tab */}
                {activeTab === 'master' && (
                    <div className="content-grid">
                        <div className="form-card">
                            <h2 className="form-title">
                                {editingMaterial ? <Edit size={20} /> : <Plus size={20} />}
                                <span>{editingMaterial ? 'Edit Material' : 'Add New Material'}</span>
                            </h2>
                            <form onSubmit={materialForm.handleSubmit(onMaterialSubmit)}>
                                <div className="form-group">
                                    <label className="form-label"><Box size={16} /> Material Name</label>
                                    <input {...materialForm.register('material_name')} className="form-input" placeholder="e.g. Steel" />
                                    <p className="invalid-feedback">{materialForm.formState.errors.material_name?.message}</p>
                                </div>
                                <div className="form-group">
                                    <label className="form-label"><ArrowUp size={16} /> Grade</label>
                                    <input {...materialForm.register('material_grade')} className="form-input" placeholder="e.g. 304" />
                                    <p className="invalid-feedback">{materialForm.formState.errors.material_grade?.message}</p>
                                </div>
                                <div className="form-group">
                                    <div>
                                        <label className="form-label"><Weight size={16} /> Density (g/cm³)</label>
                                        <input {...materialForm.register('Density')} className="form-input" placeholder="e.g. 7.85" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div>
                                        <label className="form-label"><Scale size={16} /> Unit</label>
                                        <input {...materialForm.register('unit')} className="form-input" placeholder="e.g. kg" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label"><DollarSign size={16} /> Current Price</label>
                                    <input {...materialForm.register('current_price')} type="number" step="0.01" className="form-input" placeholder="0.00" />
                                    <p className="invalid-feedback">{materialForm.formState.errors.current_price?.message}</p>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea {...materialForm.register('description')} className="form-textarea" rows="2"></textarea>
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" className="btn-submit">
                                        <Save size={18} /> Save
                                    </button>
                                    {editingMaterial && (
                                        <button type="button" onClick={() => { setEditingMaterial(null); materialForm.reset(); }} className="btn-cancel">
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="table-card">
                            <div className="table-header">
                                <h2 className="table-title">Material List</h2>
                            </div>
                            <div className="table-responsive">
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th><Box size={16} /> Name</th>
                                            <th><ArrowUp size={16} /> Grade</th>
                                            <th><Weight size={16} /> Density</th>
                                            <th><DollarSign size={16} /> Price</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {materials.map((mat) => (
                                            <tr key={mat.id}>
                                                <td>{mat.material_name}</td>
                                                <td>{mat.material_grade}</td>
                                                <td>{mat.Density}</td>
                                                <td>{mat.current_price}</td>
                                                <td className="text-right">
                                                    <button onClick={() => { setEditingMaterial(mat); materialForm.reset(mat); }} className="action-btn edit-btn"><Edit size={18} /></button>
                                                    <button onClick={() => deleteMaterial(mat.id)} className="action-btn delete-btn"><Trash2 size={18} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                        {materials.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="empty-state"><AlertCircle size={18} /> No materials found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Material Type Tab */}
                {activeTab === 'type' && (
                    <div className="content-grid">
                        <div className="form-card">
                            <h2 className="form-title">
                                {editingType ? <Edit size={20} /> : <Layers size={20} />}
                                <span>{editingType ? 'Edit Type' : 'Add New Type'}</span>
                            </h2>
                            <form onSubmit={typeForm.handleSubmit(onTypeSubmit)}>
                                <div className="form-group">
                                    <label className="form-label">Type Name</label>
                                    <input {...typeForm.register('type_name')} className="form-input" placeholder="e.g. Sheet" />
                                    <p className="invalid-feedback">{typeForm.formState.errors.type_name?.message}</p>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea {...typeForm.register('description')} className="form-textarea" rows="2"></textarea>
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" className="btn-submit">
                                        <Save size={18} /> Save
                                    </button>
                                    {editingType && (
                                        <button type="button" onClick={() => { setEditingType(null); typeForm.reset(); }} className="btn-cancel">
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="table-card">
                            <div className="table-header">
                                <h2 className="table-title">Type List</h2>
                            </div>
                            <div className="table-responsive">
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th><Layers size={16} /> Type Name</th>
                                            <th>Description</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {types.map((type) => (
                                            <tr key={type.id}>
                                                <td>{type.type_name}</td>
                                                <td>{type.description}</td>
                                                <td className="text-right">
                                                    <button onClick={() => { setEditingType(type); typeForm.reset(type); }} className="action-btn edit-btn"><Edit size={18} /></button>
                                                    <button onClick={() => deleteType(type.id)} className="action-btn delete-btn"><Trash2 size={18} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                        {types.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="empty-state"><AlertCircle size={18} /> No types found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Linking Tab */}
                {activeTab === 'link' && (
                    <div className="content-grid">
                        <div className="form-card">
                            <h2 className="form-title">
                                {editingLink ? <Edit size={20} /> : <Link2 size={20} />}
                                <span>{editingLink ? 'Edit Link' : 'Link Material to Type'}</span>
                            </h2>
                            <form onSubmit={linkForm.handleSubmit(onLinkSubmit)}>
                                <div className="form-group">
                                    <label className="form-label"><Box size={16} /> Material</label>
                                    <Controller
                                        control={linkForm.control}
                                        name="material_id"
                                        render={({ field: { onChange, value } }) => (
                                            <SearchableSelect
                                                options={materials.map(m => ({ ...m, label: `${m.material_name} (${m.material_grade})` }))}
                                                value={value}
                                                onChange={onChange}
                                                placeholder="Select Material"
                                                valueKey="id"
                                                labelKey="label"
                                                error={linkForm.formState.errors.material_id?.message}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label"><Layers size={16} /> Type</label>
                                    <Controller
                                        control={linkForm.control}
                                        name="material_type_id"
                                        render={({ field: { onChange, value } }) => (
                                            <SearchableSelect
                                                options={types}
                                                value={value}
                                                onChange={onChange}
                                                placeholder="Select Type"
                                                valueKey="id"
                                                labelKey="type_name"
                                                error={linkForm.formState.errors.material_type_id?.message}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label"><DollarSign size={16} /> Current Price</label>
                                    <input {...linkForm.register('current_price')} type="number" step="0.01" className="form-input" placeholder="0.00" />
                                    <p className="invalid-feedback">{linkForm.formState.errors.current_price?.message}</p>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Remark</label>
                                    <textarea {...linkForm.register('remark')} className="form-textarea" rows="2"></textarea>
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" className="btn-submit">
                                        <Save size={18} /> Save
                                    </button>
                                    {editingLink && (
                                        <button type="button" onClick={() => { setEditingLink(null); linkForm.reset(); }} className="btn-cancel">
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="table-card">
                            <div className="table-header">
                                <h2 className="table-title">Linked Materials</h2>
                            </div>
                            <div className="table-responsive">
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th><Box size={16} /> Material</th>
                                            <th><Layers size={16} /> Type</th>
                                            <th><DollarSign size={16} /> Price</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {links.map((link) => {
                                            const mat = materials.find(m => m.id === parseInt(link.material_id));
                                            const type = types.find(t => t.id === parseInt(link.material_type_id));
                                            return (
                                                <tr key={link.id}>
                                                    <td>{mat ? `${mat.material_name} (${mat.material_grade})` : link.material_id}</td>
                                                    <td>{type ? type.type_name : link.material_type_id}</td>
                                                    <td>{link.current_price}</td>
                                                    <td className="text-right">
                                                        <button onClick={() => { setEditingLink(link); linkForm.reset(link); }} className="action-btn edit-btn"><Edit size={18} /></button>
                                                        <button onClick={() => deleteLink(link.id)} className="action-btn delete-btn"><Trash2 size={18} /></button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {links.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="empty-state"><AlertCircle size={18} /> No links found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Materials;
