// src/components/resources/ResourceForm.jsx
import React, { useState } from 'react';
import { createResource } from '../../src/api';

const ResourceForm = ({ onResourceAdded }) => {
    const [formData, setFormData] = useState({
        name: '', type: 'Lecture Hall', capacity: '', location: '', status: 'ACTIVE'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createResource(formData);
            onResourceAdded(); 
            setFormData({ name: '', type: 'Lecture Hall', capacity: '', location: '', status: 'ACTIVE' });
        } catch (error) {
            alert("Error adding resource");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-50 border rounded-lg mb-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Add New Campus Resource</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Resource Name (e.g. Lab 01)" className="p-2 border rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                <select className="p-2 border rounded" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option>Lecture Hall</option>
                    <option>Lab</option>
                    <option>Meeting Room</option>
                    <option>Equipment</option>
                </select>
                <input type="number" placeholder="Capacity" className="p-2 border rounded" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} required />
                <input placeholder="Location (e.g. Building A)" className="p-2 border rounded" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
            </div>
            <button type="submit" className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">Add to Catalogue</button>
        </form>
    );
};

export default ResourceForm;