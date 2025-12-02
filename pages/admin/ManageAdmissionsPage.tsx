
import React, { useState } from 'react';
import { useContent } from '../../hooks/useContent';
import type { AdmissionsPageContent, FaqItem } from '../../types';
import ImageUpload from '../../components/ImageUpload';

const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500";
const labelClasses = "block text-sm font-medium text-zinc-700 dark:text-zinc-200";

const ManageAdmissionsPage = () => {
    const { content, updateAdmissionsPage } = useContent();
    const [formData, setFormData] = useState<AdmissionsPageContent>(content.admissions);
    const [status, setStatus] = useState('');
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
        const faqs = [...formData.faqs];
        faqs[index] = { ...faqs[index], [field]: value };
        setFormData(prev => ({ ...prev, faqs }));
    };

    const handleAddFaq = () => {
        const newFaq: FaqItem = { id: Date.now().toString(), question: '', answer: '' };
        setFormData(prev => ({...prev, faqs: [...prev.faqs, newFaq]}));
    };
    
    const handleDeleteFaq = (id: string) => {
        setFormData(prev => ({...prev, faqs: prev.faqs.filter(faq => faq.id !== id)}));
    };

    const handleImageChange = (base64: string) => {
        setFormData(prev => ({ ...prev, bannerImageUrl: base64 }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateAdmissionsPage(formData);
            setStatus('Admissions page content updated successfully!');
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            setStatus('Failed to update. Please try again.');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">Manage Admissions Page</h1>
            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
                
                <fieldset className="space-y-4 border p-4 rounded-md">
                    <legend className="text-xl font-semibold px-2">General Content</legend>
                    <ImageUpload 
                        label="Banner Image" 
                        currentImageUrl={formData.bannerImageUrl} 
                        onImageChange={handleImageChange}
                        aspect={3/1}
                    />
                    <div>
                        <label htmlFor="tuitionInfo" className={labelClasses}>Tuition & Financial Aid Info</label>
                        <textarea id="tuitionInfo" name="tuitionInfo" rows={3} value={formData.tuitionInfo} onChange={handleChange} className={inputClasses}></textarea>
                    </div>
                </fieldset>

                <fieldset className="space-y-4 border p-4 rounded-md">
                    <legend className="text-xl font-semibold px-2">Frequently Asked Questions</legend>
                    {formData.faqs.map((faq, index) => (
                        <div key={faq.id} className="p-3 border-t relative space-y-3">
                             <button type="button" onClick={() => handleDeleteFaq(faq.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1" aria-label={`Delete FAQ: ${faq.question}`}>&times;</button>
                            <div>
                                <label htmlFor={`faq-q-${index}`} className={labelClasses}>Question</label>
                                <input type="text" id={`faq-q-${index}`} value={faq.question} onChange={(e) => handleFaqChange(index, 'question', e.target.value)} className={inputClasses} />
                            </div>
                            <div>
                                <label htmlFor={`faq-a-${index}`} className={labelClasses}>Answer</label>
                                <textarea id={`faq-a-${index}`} rows={3} value={faq.answer} onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} className={inputClasses}></textarea>
                            </div>
                        </div>
                    ))}
                     <button type="button" onClick={handleAddFaq} className="px-4 py-2 border border-dashed border-zinc-400 rounded-md">Add FAQ</button>
                </fieldset>
                
                <div>
                    <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Save Changes</button>
                    {status && <span className="ml-4 text-green-600">{status}</span>}
                </div>
            </form>
        </div>
    );
};

export default ManageAdmissionsPage;
