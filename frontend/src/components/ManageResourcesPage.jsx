import React, { useState } from 'react';
import { Plus, LayoutGrid } from 'lucide-react';
import ResourceList from './ResourceList';
import ResourceFormModal from './ResourceForm'; 

const ManageResourcesPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-[1600px] mx-auto pb-20 bg-slate-50/30 min-h-screen">
            {/* TOP HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-8 py-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manage Resources</h1>
                    <p className="text-slate-500 mt-1 font-medium">Create, edit, and manage facilities and assets.</p>
                </div>
                
                {/* ADD RESOURCE BUTTON (Top Right Corner) */}
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-[#1e293b] hover:bg-slate-800 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-slate-200 font-bold text-sm active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Add Resource
                </button>
            </div>

            {/* THE BORDERED TABLE CONTAINER */}
            <div className="px-8">
                <ResourceList refreshTrigger={refreshTrigger} />
            </div>

            {/* POPUP MODAL FOR FORM */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="absolute inset-0 cursor-pointer" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-4xl max-h-full my-8">
                        <div className="absolute top-6 right-6 z-10">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 p-2 rounded-full shadow-md transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <ResourceFormModal onResourceAdded={handleRefresh} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageResourcesPage;