import React, { useState } from 'react';
import { useContent } from '../../hooks/useContent';
import type { ContactPageContent } from '../../types';

const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500";
const labelClasses = "block text-sm font-medium text-zinc-700 dark:text-zinc-200";

const ManageContactPage = () => {
    const { content, updateContactPage } = useContent();
    const [formData, setFormData] = useState<ContactPageContent>(content.contact);
    const [status, setStatus] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateContactPage(formData);
        setStatus('Contact info updated successfully!');
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">Manage Contact Information</h1>
            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
                <fieldset className="space-y-4">
                    <div>
                        <label htmlFor="address" className={labelClasses}>Address</label>
                        <textarea id="address" name="address" rows={3} value={formData.address} onChange={handleChange} className={inputClasses}></textarea>
                    </div>
                    <div>
                        <label htmlFor="phone" className={labelClasses}>Phone Number</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={inputClasses} />
                    </div>
                     <div>
                        <label htmlFor="email" className={labelClasses}>Email Address</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={inputClasses} />
                    </div>
                </fieldset>
                
                <div>
                    <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">Save Changes</button>
                    {status && <span className="ml-4 text-green-600">{status}</span>}
                </div>
            </form>
        </div>
    );
};

export default ManageContactPage;