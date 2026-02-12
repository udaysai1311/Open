import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
// import Loader from '../../Common/Loader/Loader';
import { Trash2, Edit, Plus, Save, X, DollarSign, Gauge, Box, Clock, AlertCircle, Scale, FileText, ArrowUp, Link2 } from 'lucide-react';
import './ProcessPricing.css';

const schema = yup.object().shape({
    material_id: yup.string().required('Material is required'),
    subcategory_id: yup.string().required('Process (Subcategory) is required'),
    minutes: yup.string(),
    unit: yup.string(),
    is_manual_rate: yup.boolean(),
    current_price: yup.number()
        .transform((value, originalValue) => originalValue === '' ? undefined : value)
        .when('is_manual_rate', {
            is: true,
            then: (schema) => schema.required('Price is required when manual rate is selected').typeError('Price must be a number').positive('Price must be positive'),
            otherwise: (schema) => schema.nullable().notRequired(),
        }),
    note: yup.string(),
    remark: yup.string(),
});

const ProcessPricing = () => {
    const [loading, setLoading] = useState(false);
    const [processes, setProcesses] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            is_manual_rate: false
        }
    });

    const isManualRate = watch('is_manual_rate');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [procRes, matRes, subRes] = await Promise.all([
                axios.get('/api/material-process'),
                axios.get('/api/material-master'),
                axios.get('/api/machinery-subcategory')
            ]);
            setProcesses(Array.isArray(procRes.data) ? procRes.data : []);
            setMaterials(Array.isArray(matRes.data) ? matRes.data : []);
            setSubcategories(Array.isArray(subRes.data) ? subRes.data : []);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (editingId) {
                await axios.put(`/api/material-process/${editingId}`, data);
            } else {
                await axios.post('/api/material-process', data);
            }
            reset();
            setEditingId(null);
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

    const handleEdit = (item) => {
        setEditingId(item.id);
        const hasPrice = item.current_price !== null && item.current_price !== undefined && item.current_price > 0;

        reset({
            ...item,
            is_manual_rate: hasPrice
        });
    };

    return (
        <div className="pricing-wrapper">
            {/* <Loader visible={loading} /> */}

            <div className="pricing-container">
                <div className="page-header">
                    <div className="header-icon-wrapper">
                        <DollarSign size={28} />
                    </div>
                    <div>
                        <h1 className="page-title">Material-Process Pricing</h1>
                        <p className="page-subtitle">Manage pricing for material processes</p>
                    </div>
                </div>

                <div className="content-grid">
                    {/* Form */}
                    <div className="form-card">
                        <h2 className="form-title">
                            {editingId ? <Edit size={20} /> : <Link2 size={20} />}
                            <span>{editingId ? 'Edit Link' : 'Add New Link'}</span>
                        </h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label className="form-label"><Box size={16} /> Material</label>
                                <select {...register('material_id')} className="form-input">
                                    <option value="">Select Material</option>
                                    {materials.map(m => <option key={m.id} value={m.id}>{m.material_name} ({m.material_grade})</option>)}
                                </select>
                                <p className="invalid-feedback">{errors.material_id?.message}</p>
                            </div>

                            <div className="form-group">
                                <label className="form-label"><Gauge size={16} /> Process (Subcategory)</label>
                                <select {...register('subcategory_id')} className="form-input">
                                    <option value="">Select Process</option>
                                    {subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                                <p className="invalid-feedback">{errors.subcategory_id?.message}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 form-group">
                                <div>
                                    <label className="form-label"><Clock size={16} /> Minutes</label>
                                    <input {...register('minutes')} className="form-input" placeholder="e.g. 45" />
                                </div>
                                <div>
                                    <label className="form-label"><Scale size={16} /> Unit</label>
                                    <input {...register('unit')} className="form-input" placeholder="e.g. min" />
                                </div>
                            </div>

                            <div className="form-checkbox-group">
                                <input
                                    type="checkbox"
                                    id="manualRate"
                                    {...register('is_manual_rate')}
                                    className="form-checkbox"
                                />
                                <label htmlFor="manualRate" className="form-label" style={{ marginBottom: 0 }}>
                                    Enter Rate Manually
                                </label>
                            </div>

                            {isManualRate && (
                                <div className="form-group animate-fadeIn">
                                    <label className="form-label"><DollarSign size={16} /> Current Price</label>
                                    <input
                                        {...register('current_price')}
                                        type="number"
                                        step="0.01"
                                        className="form-input"
                                        placeholder="0.00"
                                    />
                                    <p className="invalid-feedback">{errors.current_price?.message}</p>
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">Note</label>
                                <textarea {...register('note')} className="form-textarea" rows="2"></textarea>
                            </div>

                            <div className="flex gap-2">
                                <button type="submit" className="btn-submit">
                                    <Save size={18} /> Save
                                </button>
                                {editingId && (
                                    <button type="button" onClick={() => { setEditingId(null); reset(); }} className="btn-cancel">
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* List */}
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
                                        const sub = subcategories.find(s => s.id === parseInt(p.subcategory_id));
                                        return (
                                            <tr key={p.id}>
                                                <td>{mat ? `${mat.material_name} (${mat.material_grade})` : p.material_id}</td>
                                                <td>{sub ? sub.name : p.subcategory_id}</td>
                                                <td>{p.minutes} {p.unit}</td>
                                                <td>{p.current_price || '-'}</td>
                                                <td className="text-right">
                                                    <button onClick={() => handleEdit(p)} className="action-btn edit-btn"><Edit size={18} /></button>
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
            </div>
        </div>
    );
};

export default ProcessPricing;
