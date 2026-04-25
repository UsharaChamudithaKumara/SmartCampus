import React, { useState, useEffect } from 'react';
import { createResource, updateResource } from '../api';
import { Plus, MapPin, Users, Info, Type, X, Edit2, Clock, Trash2, Calendar } from 'lucide-react';

const ResourceForm = ({ initialData, onResourceAdded, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Lecture Hall',
        capacity: '',
        location: '',
        description: '',
        status: 'ACTIVE',
        availabilityWindows: [] 
    });

    const isEditing = !!initialData;
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    useEffect(() => {
        if (initialData) {
            // Helper to parse "Day: HH:mm-HH:mm" back into state objects if editing
            const parsedWindows = (initialData.availabilityWindows || []).map(win => {
                if (typeof win === 'string' && win.includes(':')) {
                    const [day, times] = win.split(': ');
                    const [start, end] = times.split('-');
                    return { day, start, end };
                }
                return { day: 'Monday', start: '09:00', end: '17:00' };
            });

            setFormData({
                name: initialData.name || '',
                type: initialData.type || 'Lecture Hall',
                capacity: initialData.capacity?.toString() || '',
                location: initialData.location || '',
                description: initialData.description || '',
                status: initialData.status || 'ACTIVE',
                availabilityWindows: parsedWindows
            });
        } else {
            resetForm();
        }
    }, [initialData]);

    const resetForm = () => {
        setFormData({ 
            name: '', 
            type: 'Lecture Hall', 
            capacity: '', 
            location: '', 
            description: '', 
            status: 'ACTIVE',
            availabilityWindows: [] 
        });
    };

    // --- Updated Handlers for Day/Time Objects ---
    
    const addAvailabilityWindow = () => {
        setFormData({
            ...formData,
            availabilityWindows: [...formData.availabilityWindows, { day: 'Monday', start: '09:00', end: '17:00' }]
        });
    };

    const updateWindowValue = (index, field, newValue) => {
        const updatedWindows = [...formData.availabilityWindows];
        updatedWindows[index] = { ...updatedWindows[index], [field]: newValue };
        setFormData({ ...formData, availabilityWindows: updatedWindows });
    };

    const removeWindow = (index) => {
        const updatedWindows = formData.availabilityWindows.filter((_, i) => i !== index);
        setFormData({ ...formData, availabilityWindows: updatedWindows });
    };

    const handleCancel = () => {
        resetForm();
        if (typeof onCancel === 'function') {
            onCancel();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert objects back to "Day: HH:mm-HH:mm" for the backend
            const formattedWindows = formData.availabilityWindows.map(w => 
                `${w.day}: ${w.start}-${w.end}`
            );

            const submissionData = {
                ...formData,
                capacity: parseInt(formData.capacity, 10),
                availabilityWindows: formattedWindows 
            };

            let result;
            if (isEditing) {
                result = await updateResource(initialData.id, submissionData);
            } else {
                result = await createResource(submissionData);
            }
            
            if (typeof onResourceAdded === 'function') onResourceAdded(result);
            if (typeof onSuccess === 'function') onSuccess(result);
            
            resetForm();
            alert(`Resource ${isEditing ? 'updated' : 'created'} successfully!`);
        } catch (error) {
            console.error("Submission Error:", error);
            alert(`Failed to ${isEditing ? 'update' : 'create'} resource.`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-10">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-500" /> {isEditing ? 'Edit Resource' : 'Create Resource'}
                    </h3>
                </div>

                <div className="space-y-4">
                    {/* Name Field */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Type className="w-4 h-4" /> Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                            placeholder="e.g. Main Lecture Hall" 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})} 
                            required 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Type Field */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Resource Type *</label>
                            <select 
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                                value={formData.type} 
                                onChange={e => setFormData({...formData, type: e.target.value})}
                            >
                                <option value="Lecture Hall">Lecture Hall</option>
                                <option value="Lab">Lab</option>
                                <option value="Meeting Room">Meeting Room</option>
                                <option value="Equipment">Equipment</option>
                            </select>
                        </div>

                        {/* Capacity Field */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Users className="w-4 h-4" /> Capacity *
                            </label>
                            <input 
                                type="number" 
                                placeholder="e.g. 150" 
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.capacity} 
                                onChange={e => setFormData({...formData, capacity: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    {/* Location Field */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Location *
                        </label>
                        <input 
                            placeholder="e.g. Building A, Floor 2" 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.location} 
                            onChange={e => setFormData({...formData, location: e.target.value})} 
                            required 
                        />
                    </div>

                    {/* --- Updated Availability Windows with Date --- */}
                    <div className="pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-500" /> Availability Windows
                            </label>
                            <button 
                                type="button"
                                onClick={addAvailabilityWindow}
                                className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 transition-all flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" /> Add Window
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            {formData.availabilityWindows.map((window, index) => (
                                <div key={index} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 group">
                                    <div className="flex items-center gap-2 flex-1">
                                        {/* Day Select */}
                                        <select 
                                            className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
                                            value={window.day}
                                            onChange={(e) => updateWindowValue(index, 'day', e.target.value)}
                                        >
                                            {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                                        </select>

                                        {/* Start Time */}
                                        <input 
                                            type="time" 
                                            value={window.start}
                                            onChange={(e) => updateWindowValue(index, 'start', e.target.value)}
                                            className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm outline-none"
                                        />
                                        <span className="text-slate-400">-</span>
                                        {/* End Time */}
                                        <input 
                                            type="time" 
                                            value={window.end}
                                            onChange={(e) => updateWindowValue(index, 'end', e.target.value)}
                                            className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm outline-none"
                                        />
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => removeWindow(index)}
                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {formData.availabilityWindows.length === 0 && (
                            <p className="text-xs text-slate-400 italic mt-2">No availability windows defined. Defaulting to fully available.</p>
                        )}
                    </div>

                    {/* Status Field */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Operational Status</label>
                        <select 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            value={formData.status} 
                            onChange={e => setFormData({...formData, status: e.target.value})}
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="OUT_OF_SERVICE">Under Maintenance</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Actions Area */}
            <div className="flex justify-end gap-3">
                <button 
                    type="button" 
                    onClick={handleCancel}
                    className="px-6 py-3 rounded-xl text-slate-600 font-semibold border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                    <X className="w-4 h-4" /> Cancel
                </button>

                <button 
                    type="submit" 
                    className="px-8 py-3 bg-[#1e293b] text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2"
                >
                    {isEditing ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {isEditing ? 'Update Resource' : 'Create Resource'}
                </button>
            </div>
        </form>
    );
};

export default ResourceForm;