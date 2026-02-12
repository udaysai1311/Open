import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
// import Loader from '../../Common/Loader/Loader';
import SearchableSelect from '../../Common/SearchableSelect/SearchableSelect';
import { Trash2, Edit, Plus, Save, X, Database, Settings, DollarSign, Box, Wrench, Gauge, FileText, AlertCircle, Link2, Clock, Scale } from 'lucide-react';
import './Machinery.css';

// --- Validation Schemas ---
const categorySchema = yup.object().shape({
    category_name: yup.string().required('Category Name is required'),
    description: yup.string(),
    remark: yup.string(),
});

// For subcategories, category_id is required.
const subcategorySchema = yup.object().shape({
    category_id: yup.string().required('Category is required'),
    subcategory_name: yup.string().required('Subcategory Name is required'),
    description: yup.string(),
    remark: yup.string(),
});

const processPricingSchema = yup.object().shape({
    material_id: yup.string().required('Material is required'),
    process_id: yup.string().required('Process is required'),
    minutes: yup.number().typeError('Minutes must be a number').positive('Minutes must be positive').nullable(),
    unit: yup.string(),
    rate: yup.number()
        .transform((value, originalValue) => originalValue === '' ? undefined : value)
        .when('is_manual_rate', {
            is: true,
            then: (schema) => schema.required('Price is required when manual rate is selected').typeError('Price must be a number').positive('Price must be positive'),
            otherwise: (schema) => schema.nullable().notRequired(),
        }),
    is_manual_rate: yup.boolean(),
    note: yup.string(),
    remark: yup.string(),
});

const Machinery = () => {
    const [activeTab, setActiveTab] = useState('category');
    const [loading, setLoading] = useState(false);

    // Data States
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [materials, setMaterials] = useState([]); // For Process Pricing
    const [processes, setProcesses] = useState([]); // For Process Pricing (which are subcategories)

    // Main Machinery Categories - Temporary frontend data
    const [mainCategories] = useState([
        { id: 1, name: 'Manufacturing' },
        { id: 2, name: 'Inspection' },
        { id: 3, name: 'Testing' },
        { id: 4, name: 'Special Process' },
        { id: 5, name: 'Packing & Shipping' },
        { id: 6, name: 'Others' }
    ]);

    // For future backend integration (commented out)
    // const [mainCategories, setMainCategories] = useState([]);

    // Edit States
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingSubcategory, setEditingSubcategory] = useState(null);
    const [editingProcessId, setEditingProcessId] = useState(null);

    // Forms
    const categoryForm = useForm({ resolver: yupResolver(categorySchema) });
    const subcategoryForm = useForm({ resolver: yupResolver(subcategorySchema) });
    const processPricingForm = useForm({
        resolver: yupResolver(processPricingSchema),
        defaultValues: {
            is_manual_rate: false
        }
    });

    const isManualRate = processPricingForm.watch('is_manual_rate');

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            const [masterRes, subRes, procRes, matRes] = await Promise.all([
                axios.get('/api/machinery-master'),
                axios.get('/api/machinery-subcategory'),
                axios.get('/api/material-process'),
                axios.get('/api/material-master')
                // For future backend integration, uncomment below:
                // axios.get('/api/main-machinery-categories')
            ]);
            setCategories(Array.isArray(masterRes.data) ? masterRes.data : []);
            setSubcategories(Array.isArray(subRes.data) ? subRes.data : []);
            setProcesses(Array.isArray(procRes.data) ? procRes.data.map(p => ({ ...p, minutes: p.minutes ?? p.hours })) : []);
            setMaterials(Array.isArray(matRes.data) ? matRes.data : []);

            // For future backend integration, uncomment below:
            // const mainCatRes = await axios.get('/api/main-machinery-categories');
            // setMainCategories(Array.isArray(mainCatRes.data) ? mainCatRes.data : []);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Handlers for Machinery Master ---
    const onMasterSubmit = async (data) => {
        setLoading(true);
        try {
            if (editingCategory) {
                await axios.put(`/api/machinery-master/${editingCategory.id}`, data);
            } else {
                await axios.post('/api/machinery-master', data);
            }
            categoryForm.reset();
            setEditingCategory(null);
            fetchData();
        } catch (error) {
            console.error("Error saving category", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteMaster = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        setLoading(true);
        try {
            await axios.delete(`/api/machinery-master/${id}`);
            fetchData();
        } catch (error) {
            console.error("Error deleting category", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Handlers for Subcategory ---
    const onSubSubmit = async (data) => {
        setLoading(true);
        try {
            if (editingSub) {
                await axios.put(`/api/machinery-subcategory/${editingSub.id}`, data);
            } else {
                await axios.post('/api/machinery-subcategory', data);
            }
            subForm.reset();
            setEditingSub(null);
            fetchData();
        } catch (error) {
            console.error("Error saving subcategory", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteSub = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        setLoading(true);
        try {
            await axios.delete(`/api/machinery-subcategory/${id}`);
            fetchData();
        } catch (error) {
            console.error("Error deleting subcategory", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Handlers for Process Pricing ---
    const onProcessSubmit = async (data) => {
        setLoading(true);
        try {
            if (editingProcessId) {
                await axios.put(`/api/material-process/${editingProcessId}`, data);
            } else {
                await axios.post('/api/material-process', data);
            }
            processPricingForm.reset();
            setEditingProcessId(null);
            fetchData();
        } catch (error) {
            console.error("Error saving process link", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProcess = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        setLoading(true);
        try {
            await axios.delete(`/api/material-process/${id}`);
            fetchData();
        } catch (error) {
            console.error("Error deleting process link", error);
        } finally {
            setLoading(false);
        }
    };

    const handleProcessEdit = (item) => {
        setEditingProcessId(item.id);
        const hasPrice = item.current_price !== null && item.current_price !== undefined && item.current_price > 0;

        processPricingForm.reset({
            ...item,
            is_manual_rate: hasPrice
        });
    };

    return (
        <div className="machinery-wrapper">
            {/* <Loader visible={loading} /> */}

            <div className="machinery-container">
                <div className="page-header">
                    <div className="header-icon-wrapper">
                        <Wrench size={28} />
                    </div>
                    <div>
                        <h1 className="page-title">Machinery Management</h1>
                        <p className="page-subtitle">Manage machine categories, processes, and pricing</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs-container">
                    <button
                        onClick={() => setActiveTab('category')}
                        className={`tab-btn ${activeTab === 'category' ? 'active' : ''}`}
                    >
                        <Gauge size={18} /> Categories
                    </button>
                    <button
                        onClick={() => setActiveTab('sub')}
                        className={`tab-btn ${activeTab === 'sub' ? 'active' : ''}`}
                    >
                        <Settings size={18} /> Subcategories
                    </button>
                    <button
                        onClick={() => setActiveTab('pricing')}
                        className={`tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
                    >
                        <DollarSign size={18} /> Process Pricing
                    </button>
                </div>

                {/* Master Tab */}
                {activeTab === 'category' && (
                    <div className="content-grid">
                        <div className="form-card">
                            <h2 className="form-title">
                                {editingCategory ? <Edit size={20} /> : <Plus size={20} />}
                                {editingCategory ? 'Edit Category' : 'Add Category'}
                            </h2>
                            <form onSubmit={categoryForm.handleSubmit(onMasterSubmit)}>
                                <div className="form-group">
                                    <label className="form-label"><Database size={16} /> Main Machinery Category</label>
                                    <Controller
                                        control={categoryForm.control}
                                        name="main_category_id"
                                        render={({ field: { onChange, value } }) => (
                                            <SearchableSelect
                                                options={mainCategories}
                                                value={value}
                                                onChange={onChange}
                                                placeholder="Select Main Category"
                                                label=""
                                                valueKey="id"
                                                labelKey="name"
                                                error={categoryForm.formState.errors.main_category_id?.message}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label"><FileText size={16} /> Category Name</label>
                                    <input {...categoryForm.register('category_name')} className="form-input" placeholder="e.g. Cutting" />
                                    <p className="invalid-feedback">{categoryForm.formState.errors.category_name?.message}</p>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea {...categoryForm.register('description')} className="form-textarea" rows="3"></textarea>
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" className="btn-submit">
                                        <Save size={18} /> Save
                                    </button>
                                    {editingCategory && (
                                        <button type="button" onClick={() => { setEditingCategory(null); categoryForm.reset(); }} className="btn-cancel">
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="table-card">
                            <div className="table-header">
                                <h2 className="table-title">Categories List</h2>
                            </div>
                            <div className="table-responsive">
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th><FileText size={16} /> Name</th>
                                            <th>Description</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((m) => (
                                            <tr key={m.id}>
                                                <td>{m.name}</td>
                                                <td>{m.description}</td>
                                                <td className="text-right">
                                                    <button onClick={() => { setEditingCategory(m); categoryForm.reset({ category_name: m.name, ...m }); }} className="action-btn edit-btn"><Edit size={18} /></button>
                                                    <button onClick={() => deleteMaster(m.id)} className="action-btn delete-btn"><Trash2 size={18} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                        {categories.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="empty-state"><AlertCircle size={18} /> No categories found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Subcategory Tab */}
                {activeTab === 'sub' && (
                    <div className="content-grid">
                        <div className="form-card">
                            <h2 className="form-title">
                                {editingSubcategory ? <Edit size={20} /> : <Plus size={20} />}
                                {editingSubcategory ? 'Edit Subcategory' : 'Add Subcategory'}
                            </h2>
                            <form onSubmit={subcategoryForm.handleSubmit(onSubSubmit)}>
                                <div className="form-group">
                                    <label className="form-label"><Gauge size={16} /> Category</label>
                                    <Controller
                                        control={subcategoryForm.control}
                                        name="category_id"
                                        render={({ field: { onChange, value } }) => (
                                            <SearchableSelect
                                                options={categories}
                                                value={value}
                                                onChange={onChange}
                                                placeholder="Select Category"
                                                label=""
                                                valueKey="id"
                                                labelKey="name"
                                                error={subcategoryForm.formState.errors.category_id?.message}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label"><FileText size={16} /> Subcategory Name</label>
                                    <input {...subcategoryForm.register('subcategory_name')} className="form-input" placeholder="e.g. Laser Cutting" />
                                    <p className="invalid-feedback">{subcategoryForm.formState.errors.subcategory_name?.message}</p>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea {...subcategoryForm.register('description')} className="form-textarea" rows="3"></textarea>
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" className="btn-submit">
                                        <Save size={18} /> Save
                                    </button>
                                    {editingSubcategory && (
                                        <button type="button" onClick={() => { setEditingSubcategory(null); subcategoryForm.reset(); }} className="btn-cancel">
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="table-card">
                            <div className="table-header">
                                <h2 className="table-title">Subcategories List</h2>
                            </div>
                            <div className="table-responsive">
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th><Gauge size={16} /> Category</th>
                                            <th><FileText size={16} /> Name</th>
                                            <th>Description</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subcategories.map((sub) => {
                                            const category = categories.find(m => m.id === parseInt(sub.category_id));
                                            return (
                                                <tr key={sub.id}>
                                                    <td>{category ? category.name : sub.category_id}</td>
                                                    <td>{sub.subcategory_name}</td>
                                                    <td>{sub.description}</td>
                                                    <td className="text-right">
                                                        <button onClick={() => { setEditingSubcategory(sub); subcategoryForm.reset(sub); }} className="action-btn edit-btn"><Edit size={18} /></button>
                                                        <button onClick={() => deleteSub(sub.id)} className="action-btn delete-btn"><Trash2 size={18} /></button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {subcategories.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="empty-state"><AlertCircle size={18} /> No subcategories found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pricing Tab */}
                {activeTab === 'pricing' && (
                    <div className="content-grid">
                        <div className="form-card">
                            <h2 className="form-title">
                                {editingProcessId ? <Edit size={20} /> : <Link2 size={20} />}
                                <span>{editingProcessId ? 'Edit Link' : 'Add New Link'}</span>
                            </h2>
                            <form onSubmit={processPricingForm.handleSubmit(onProcessSubmit)}>
                                <div className="form-group">
                                    <label className="form-label"><Box size={16} /> Material</label>
                                    <Controller
                                        control={processPricingForm.control}
                                        name="material_id"
                                        render={({ field: { onChange, value } }) => (
                                            <SearchableSelect
                                                options={materials.map(m => ({ ...m, label: `${m.material_name} (${m.material_grade})` }))}
                                                value={value}
                                                onChange={onChange}
                                                placeholder="Select Material"
                                                valueKey="id"
                                                labelKey="label"
                                                error={processPricingForm.formState.errors.material_id?.message}
                                            />
                                        )}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label"><Gauge size={16} /> Process (Subcategory)</label>
                                    <Controller
                                        control={processPricingForm.control}
                                        name="process_id"
                                        render={({ field: { onChange, value } }) => (
                                            <SearchableSelect
                                                options={subcategories} // assuming processes are populated with subcategories
                                                value={value}
                                                onChange={onChange}
                                                placeholder="Select Process"
                                                valueKey="id"
                                                labelKey="name"
                                                error={processPricingForm.formState.errors.process_id?.message}
                                            />
                                        )}
                                    />
                                </div>

                                <div className="form-group">
                                    <div>
                                        <label className="form-label"><Clock size={16} /> Minutes</label>
                                        <input {...processPricingForm.register('minutes')} className="form-input" placeholder="e.g. 45" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div>
                                        <label className="form-label"><Scale size={16} /> Unit</label>
                                        <input {...processPricingForm.register('unit')} className="form-input" placeholder="e.g. min" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="d-flex align-items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="manualRate"
                                            {...processPricingForm.register('is_manual_rate')}
                                            className="form-checkbox"
                                        />
                                        <label htmlFor="manualRate" className="form-label" style={{ margin: 0 }} >Enter Rate Manually</label>
                                    </div>
                                </div>

                                {isManualRate && (
                                    <div className="form-group animate-fadeIn">
                                        <label className="form-label"><DollarSign size={16} /> Current Price</label>
                                        <input
                                            {...processPricingForm.register('rate')}
                                            type="number"
                                            step="0.01"
                                            className="form-input"
                                            placeholder="0.00"
                                        />
                                        <p className="invalid-feedback">{processPricingForm.formState.errors.rate?.message}</p>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label className="form-label">Note</label>
                                    <textarea {...processPricingForm.register('note')} className="form-textarea" rows="2"></textarea>
                                </div>

                                <div className="flex gap-2">
                                    <button type="submit" className="btn-submit">
                                        <Save size={18} /> Save
                                    </button>
                                    {editingProcessId && (
                                        <button type="button" onClick={() => { setEditingProcessId(null); processPricingForm.reset(); }} className="btn-cancel">
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="table-card">
                            <div className="table-header">
                                <h2 className="table-title">Pricing List</h2>
                            </div>
                            <div className="table-responsive">
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th><Box size={16} /> Material</th>
                                            <th><Gauge size={16} /> Process</th>
                                            <th><Clock size={16} /> Minutes</th>
                                            <th><DollarSign size={16} /> Price</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {processes.map((p) => {
                                            const mat = materials.find(m => m.id === parseInt(p.material_id));
                                            const sub = subcategories.find(s => s.id === parseInt(p.process_id));
                                            return (
                                                <tr key={p.id}>
                                                    <td>{mat ? `${mat.material_name} (${mat.material_grade})` : p.material_id}</td>
                                                    <td>{sub ? sub.subcategory_name : p.process_id}</td>
                                                    <td>{p.minutes} {p.unit}</td>
                                                    <td>{p.rate || '-'}</td>
                                                    <td className="text-right">
                                                        <button onClick={() => handleProcessEdit(p)} className="action-btn edit-btn"><Edit size={18} /></button>
                                                        <button onClick={() => deleteProcess(p.id)} className="action-btn delete-btn"><Trash2 size={18} /></button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {processes.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="empty-state"><AlertCircle size={18} /> No process pricing found</td>
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

export default Machinery;
