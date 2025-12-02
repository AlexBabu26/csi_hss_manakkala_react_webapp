
import React, { useState } from 'react';
import { useContent } from '../../hooks/useContent';
import type { HomePageContent } from '../../types';
import ImageUpload from '../../components/ImageUpload';

const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500";
const labelClasses = "block text-sm font-medium text-zinc-700 dark:text-zinc-200";

const ManageHomePage = () => {
    const { content, updateHomePage } = useContent();
    const [formData, setFormData] = useState<HomePageContent>(content.home);
    const [status, setStatus] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section: keyof HomePageContent, index?: number, field?: string) => {
        const { name, value } = e.target;
        if (Array.isArray(formData[section])) {
            const items = [...(formData[section] as any[])];
            items[index!][field || name] = value;
            setFormData(prev => ({ ...prev, [section]: items }));
        } else if(typeof formData[section] === 'object') {
            setFormData(prev => ({...prev, [section]: { ...prev[section], [name]: value }}));
        }
    };
    
    const handleImageChange = (base64: string, section: keyof HomePageContent, index?: number) => {
        if (Array.isArray(formData[section])) {
             const items = [...(formData[section] as any[])];
            items[index!]['imageUrl'] = base64;
            setFormData(prev => ({ ...prev, [section]: items }));
        } else {
             setFormData(prev => ({...prev, [section]: { ...prev[section], imageUrl: base64 }}));
        }
    };

    const handleAddTestimonial = () => {
        const newTestimonial = { id: Date.now().toString(), quote: '', name: '', role: '', imageUrl: 'https://placehold.co/100x100?text=New' };
        setFormData(prev => ({ ...prev, testimonials: [...prev.testimonials, newTestimonial] }));
    };
    
    const handleDeleteTestimonial = (id: string) => {
        setFormData(prev => ({ ...prev, testimonials: prev.testimonials.filter(t => t.id !== id) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateHomePage(formData);
            setStatus('Homepage content updated successfully!');
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            setStatus('Failed to update. Please try again.');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">Manage Home Page</h1>
            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
                {/* Hero Section */}
                <fieldset className="space-y-4 border p-4 rounded-md">
                    <legend className="text-xl font-semibold px-2">Hero Section</legend>
                    <ImageUpload 
                        label="Hero Background Image" 
                        currentImageUrl={formData.hero.imageUrl} 
                        onImageChange={(b64) => handleImageChange(b64, 'hero')}
                        aspect={16/9} 
                    />
                    <div>
                        <label htmlFor="heading" className={labelClasses}>Heading</label>
                        <input type="text" id="heading" name="heading" value={formData.hero.heading} onChange={(e) => handleChange(e, 'hero')} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="subheading" className={labelClasses}>Subheading</label>
                        <textarea id="subheading" name="subheading" rows={3} value={formData.hero.subheading} onChange={(e) => handleChange(e, 'hero')} className={inputClasses}></textarea>
                    </div>
                </fieldset>

                {/* Features Section */}
                <fieldset className="space-y-4 border p-4 rounded-md">
                    <legend className="text-xl font-semibold px-2">"Why Choose Us" Features</legend>
                    {formData.features.map((feature, index) => (
                        <div key={feature.id} className="p-3 border-t">
                            <h3 className="font-medium mb-2">Feature {index + 1}</h3>
                             <div>
                                <label htmlFor={`feature-title-${index}`} className={labelClasses}>Title</label>
                                <input type="text" id={`feature-title-${index}`} name="title" value={feature.title} onChange={(e) => handleChange(e, 'features', index)} className={inputClasses} />
                            </div>
                            <div>
                                <label htmlFor={`feature-desc-${index}`} className={labelClasses}>Description</label>
                                <input type="text" id={`feature-desc-${index}`} name="description" value={feature.description} onChange={(e) => handleChange(e, 'features', index)} className={inputClasses} />
                            </div>
                        </div>
                    ))}
                </fieldset>
                
                 {/* Testimonials Section */}
                <fieldset className="space-y-4 border p-4 rounded-md">
                    <legend className="text-xl font-semibold px-2">Testimonials</legend>
                    {formData.testimonials.map((testimonial, index) => (
                        <div key={testimonial.id} className="p-3 border-t relative">
                             <h3 className="font-medium mb-2">Testimonial {index + 1}</h3>
                             <button type="button" onClick={() => handleDeleteTestimonial(testimonial.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1" aria-label={`Delete testimonial from ${testimonial.name}`}>&times;</button>
                             <ImageUpload 
                                label="Author Image" 
                                currentImageUrl={testimonial.imageUrl} 
                                onImageChange={(b64) => handleImageChange(b64, 'testimonials', index)}
                                aspect={1}
                             />
                             <div>
                                <label htmlFor={`testimonial-name-${index}`} className={labelClasses}>Name</label>
                                <input type="text" id={`testimonial-name-${index}`} value={testimonial.name} onChange={(e) => handleChange(e, 'testimonials', index, 'name')} className={inputClasses} />
                            </div>
                            <div>
                                <label htmlFor={`testimonial-role-${index}`} className={labelClasses}>Role</label>
                                <input type="text" id={`testimonial-role-${index}`} value={testimonial.role} onChange={(e) => handleChange(e, 'testimonials', index, 'role')} className={inputClasses} />
                            </div>
                            <div>
                                <label htmlFor={`testimonial-quote-${index}`} className={labelClasses}>Quote</label>
                                <textarea id={`testimonial-quote-${index}`} rows={4} value={testimonial.quote} onChange={(e) => handleChange(e, 'testimonials', index, 'quote')} className={inputClasses}></textarea>
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddTestimonial} className="px-4 py-2 border border-dashed border-zinc-400 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700">Add Testimonial</button>
                </fieldset>

                <div>
                    <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">Save Changes</button>
                    {status && <span className="ml-4 text-green-600">{status}</span>}
                </div>
            </form>
        </div>
    );
};

export default ManageHomePage;
