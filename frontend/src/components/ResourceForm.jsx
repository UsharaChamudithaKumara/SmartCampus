import React, { useState } from 'react';
import { createResource } from '../api';
import { Plus, MapPin, Users, Info, Type, CheckCircle } from 'lucide-react';

const ResourceForm = ({ onResourceAdded }) => {
    // 1. Correct Initialization: Ensure all fields used in the form are present
    const [formData, setFormData] = useState({
        name: '',
        type: 'Lecture Hall',
        capacity: '',
        location: '',
        description: '',
        status: 'ACTIVE'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 2. Data Transformation: Convert capacity to a number for the backend
            const submissionData = {
                ...formData,
                capacity: parseInt(formData.capacity, 10),
                // Since we removed windows, we explicitly set it to null or a default
                availabilityWindows: null 
            };

            await createResource(submissionData);
            
            // 3. Success Feedback
            onResourceAdded();
            
            // 4. Reset Form
            setFormData({ 
                name: '', 
                type: 'Lecture Hall', 
                capacity: '', 
                location: '', 
                description: '', 
                status: 'ACTIVE' 
            });

            alert("Resource created successfully!");
        } catch (error) {
            console.error("Submission Error:", error);
            alert("Failed to create resource. Check if the backend is running on port 8081.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-10">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-500" /> Basic Information
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

                    {/* Description Field */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Detailed Description *</label>
                        <textarea 
                            rows="4"
                            placeholder="Describe facilities, available tools, etc..." 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            value={formData.description} 
                            onChange={e => setFormData({...formData, description: e.target.value})} 
                            required 
                        />
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

            {/* Actions */}
            <div className="flex justify-end gap-4">
                <button 
                    type="button" 
                    onClick={() => setFormData({ name: '', type: 'Lecture Hall', capacity: '', location: '', description: '', status: 'ACTIVE' })}
                    className="px-6 py-3 rounded-xl text-slate-500 font-semibold hover:bg-slate-100 transition-all"
                >
                    Clear Form
                </button>
                <button 
                    type="submit" 
                    className="px-8 py-3 bg-[#1e293b] text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Create Resource
                </button>
            </div>
        </form>
    );
};

export default ResourceForm;