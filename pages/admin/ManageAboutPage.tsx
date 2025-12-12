
import React, { useState } from 'react';
import { useContent } from '../../hooks/useContent';
import type { AboutPageContent, Leadership, Facility } from '../../types';
import ImageUpload from '../../components/ImageUpload';
import DraggableList from '../../components/DraggableList';

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

    const handleLeadershipReorder = (reorderedItems: Leadership[]) => {
        setFormData(prev => ({ ...prev, leadership: reorderedItems }));
    };

    const handleFacilitiesReorder = (reorderedItems: Facility[]) => {
        setFormData(prev => ({ ...prev, facilities: reorderedItems }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateAboutPage(formData);
        setStatus('About page content updated successfully!');
        setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            setStatus('Failed to update. Please try again.');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">Manage About Page</h1>
            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
                
                <fieldset className="space-y-4 border p-4 rounded-md">
                    <legend className="text-xl font-semibold px-2">General Content</legend>
                     <ImageUpload 
                        label="Banner Image" 
                        currentImageUrl={formData.bannerImageUrl} 
                        onImageChange={(b64) => handleImageChange(b64, 'bannerImageUrl')}
                        aspect={3/1}
                    />
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
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 mb-4">
                        <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">Drag and drop items to reorder how they appear on the website</span>
                        </p>
                    </div>
                    <DraggableList
                        items={formData.leadership}
                        onReorder={handleLeadershipReorder}
                        dragHandleLabel="Drag to reorder leadership members"
                        renderItem={(person, index) => (
                            <div className="space-y-3">
                                <button 
                                    type="button" 
                                    onClick={() => handleDeleteItem(person.id, 'leadership')} 
                                    className="absolute top-2 right-12 text-red-500 hover:text-red-700 bg-white dark:bg-zinc-700 rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                                    aria-label={`Delete ${person.name}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            <ImageUpload 
                                label="Profile Image" 
                                currentImageUrl={person.imageUrl} 
                                onImageChange={(b64) => handleImageChange(b64, 'leadership', index)}
                                aspect={1}
                            />
                                <input 
                                    type="text" 
                                    placeholder="Name" 
                                    value={person.name} 
                                    onChange={(e) => handleLeadershipChange(index, 'name', e.target.value)} 
                                    className={inputClasses} 
                                />
                                <input 
                                    type="text" 
                                    placeholder="Title" 
                                    value={person.title} 
                                    onChange={(e) => handleLeadershipChange(index, 'title', e.target.value)} 
                                    className={inputClasses} 
                                />
                        </div>
                        )}
                    />
                    <button type="button" onClick={() => handleAddItem('leadership')} className="w-full px-4 py-3 border-2 border-dashed border-primary-300 dark:border-primary-700 rounded-md hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-primary-600 dark:text-primary-400 font-medium">
                        + Add Leadership Member
                    </button>
                </fieldset>

                <fieldset className="space-y-4 border p-4 rounded-md">
                    <legend className="text-xl font-semibold px-2">Facilities</legend>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 mb-4">
                        <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">Drag and drop items to reorder how they appear on the website</span>
                        </p>
                    </div>
                    <DraggableList
                        items={formData.facilities}
                        onReorder={handleFacilitiesReorder}
                        dragHandleLabel="Drag to reorder facilities"
                        renderItem={(facility, index) => (
                            <div className="space-y-3">
                                <button 
                                    type="button" 
                                    onClick={() => handleDeleteItem(facility.id, 'facilities')} 
                                    className="absolute top-2 right-12 text-red-500 hover:text-red-700 bg-white dark:bg-zinc-700 rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                                    aria-label={`Delete ${facility.caption} image`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            <ImageUpload 
                                label="Facility Image" 
                                currentImageUrl={facility.imageUrl} 
                                onImageChange={(b64) => handleImageChange(b64, 'facilities', index)}
                                aspect={3/2}
                            />
                                <input 
                                    type="text" 
                                    placeholder="Caption" 
                                    value={facility.caption} 
                                    onChange={(e) => handleFacilityChange(index, 'caption', e.target.value)} 
                                    className={inputClasses} 
                                />
                                <input 
                                    type="text" 
                                    placeholder="Alt Text" 
                                    value={facility.altText} 
                                    onChange={(e) => handleFacilityChange(index, 'altText', e.target.value)} 
                                    className={inputClasses} 
                                />
                        </div>
                        )}
                    />
                    <button type="button" onClick={() => handleAddItem('facilities')} className="w-full px-4 py-3 border-2 border-dashed border-primary-300 dark:border-primary-700 rounded-md hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-primary-600 dark:text-primary-400 font-medium">
                        + Add Facility Image
                    </button>
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
