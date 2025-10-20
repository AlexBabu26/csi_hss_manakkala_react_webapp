import React, { useState } from 'react';
import { useContent } from '../../hooks/useContent';
import type { AboutPageContent, Leadership, Facility } from '../../types';
import ImageUpload from '../../components/ImageUpload';

const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500";
const labelClasses = "block text-sm font-medium text-zinc-700 dark:text-zinc-200";

const ManageAboutPage = () => {
    const { content, updateAboutPage } = useContent();
    const [formData, setFormData] = useState<AboutPageContent>(content.about);
    const [status, setStatus] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLeadershipChange = (index: number, field: keyof Leadership, value: string) => {
        const items = [...formData.leadership];
        items[index] = { ...items[index], [field]: value };
        setFormData(prev => ({ ...prev, leadership: items }));
    };

    const handleFacilityChange = (index: number, field: keyof Facility, value: string) => {
        const items = [...formData.facilities];
        items[index] = { ...items[index], [field]: value };
        setFormData(prev => ({ ...prev, facilities: items }));
    };

    const handleImageChange = (base64: string, section: 'bannerImageUrl' | 'leadership' | 'facilities', index?: number) => {
        if (section === 'bannerImageUrl') {
            setFormData(prev => ({ ...prev, bannerImageUrl: base64 }));
        } else {
            const items = [...formData[section]];
            items[index!] = { ...items[index!], imageUrl: base64 };
            setFormData(prev => ({ ...prev, [section]: items }));
        }
    };
    
    const handleAddItem = (section: 'leadership' | 'facilities') => {
        if(section === 'leadership') {
            const newItem: Leadership = { id: Date.now().toString(), name: '', title: '', imageUrl: 'https://placehold.co/200x200?text=New' };
            setFormData(prev => ({ ...prev, leadership: [...prev.leadership, newItem] }));
        } else {
            const newItem: Facility = { id: Date.now().toString(), caption: '', imageUrl: 'https://placehold.co/600x400?text=New', altText: '' };
            setFormData(prev => ({ ...prev, facilities: [...prev.facilities, newItem] }));
        }
    };

    const handleDeleteItem = (id: string, section: 'leadership' | 'facilities') => {
        const items = formData[section].filter(item => item.id !== id);
        setFormData(prev => ({ ...prev, [section]: items }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateAboutPage(formData);
        setStatus('About page content updated successfully!');
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">Manage About Page</h1>
            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
                
                <fieldset className="space-y-4 border p-4 rounded-md">
                    <legend className="text-xl font-semibold px-2">General Content</legend>
                     <ImageUpload label="Banner Image" currentImageUrl={formData.bannerImageUrl} onImageChange={(b64) => handleImageChange(b64, 'bannerImageUrl')} />
                    <div>
                        <label htmlFor="mission" className={labelClasses}>Our Mission</label>
                        <textarea id="mission" name="mission" rows={4} value={formData.mission} onChange={handleChange} className={inputClasses}></textarea>
                    </div>
                    <div>
                        <label htmlFor="philosophy" className={labelClasses}>Our Philosophy</label>
                        <textarea id="philosophy" name="philosophy" rows={4} value={formData.philosophy} onChange={handleChange} className={inputClasses}></textarea>
                    </div>
                </fieldset>

                <fieldset className="space-y-4 border p-4 rounded-md">
                    <legend className="text-xl font-semibold px-2">Leadership Team</legend>
                    {formData.leadership.map((person, index) => (
                        <div key={person.id} className="p-3 border-t relative space-y-3">
                            <button type="button" onClick={() => handleDeleteItem(person.id, 'leadership')} className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1" aria-label={`Delete ${person.name}`}>&times;</button>
                            <ImageUpload label="Profile Image" currentImageUrl={person.imageUrl} onImageChange={(b64) => handleImageChange(b64, 'leadership', index)} />
                            <input type="text" placeholder="Name" value={person.name} onChange={(e) => handleLeadershipChange(index, 'name', e.target.value)} className={inputClasses} />
                            <input type="text" placeholder="Title" value={person.title} onChange={(e) => handleLeadershipChange(index, 'title', e.target.value)} className={inputClasses} />
                        </div>
                    ))}
                    <button type="button" onClick={() => handleAddItem('leadership')} className="px-4 py-2 border border-dashed border-zinc-400 rounded-md">Add Leadership Member</button>
                </fieldset>

                <fieldset className="space-y-4 border p-4 rounded-md">
                    <legend className="text-xl font-semibold px-2">Facilities</legend>
                    {formData.facilities.map((facility, index) => (
                        <div key={facility.id} className="p-3 border-t relative space-y-3">
                            <button type="button" onClick={() => handleDeleteItem(facility.id, 'facilities')} className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1" aria-label={`Delete ${facility.caption} image`}>&times;</button>
                            <ImageUpload label="Facility Image" currentImageUrl={facility.imageUrl} onImageChange={(b64) => handleImageChange(b64, 'facilities', index)} />
                            <input type="text" placeholder="Caption" value={facility.caption} onChange={(e) => handleFacilityChange(index, 'caption', e.target.value)} className={inputClasses} />
                            <input type="text" placeholder="Alt Text" value={facility.altText} onChange={(e) => handleFacilityChange(index, 'altText', e.target.value)} className={inputClasses} />
                        </div>
                    ))}
                    <button type="button" onClick={() => handleAddItem('facilities')} className="px-4 py-2 border border-dashed border-zinc-400 rounded-md">Add Facility Image</button>
                </fieldset>

                <div>
                    <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Save Changes</button>
                    {status && <span className="ml-4 text-green-600">{status}</span>}
                </div>
            </form>
        </div>
    );
};

export default ManageAboutPage;
