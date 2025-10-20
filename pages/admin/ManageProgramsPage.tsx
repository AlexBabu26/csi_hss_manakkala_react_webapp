
import React, { useState } from 'react';
import { useContent } from '../../hooks/useContent';
import type { ProgramsPageContent, Program } from '../../types';
import ImageUpload from '../../components/ImageUpload';

const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500";
const labelClasses = "block text-sm font-medium text-zinc-700 dark:text-zinc-200";

const ManageProgramsPage = () => {
    const { content, updateProgramsPage } = useContent();
    const [formData, setFormData] = useState<ProgramsPageContent>(content.programs);
    const [status, setStatus] = useState('');

    const handleProgramChange = (programKey: keyof ProgramsPageContent['programs'], field: keyof Program, value: string) => {
        setFormData(prev => ({
            ...prev,
            programs: {
                ...prev.programs,
                [programKey]: {
                    ...prev.programs[programKey],
                    [field]: value
                }
            }
        }));
    };
    
    const handleImageChange = (base64: string, section: 'bannerImageUrl' | keyof ProgramsPageContent['programs']) => {
        if (section === 'bannerImageUrl') {
            setFormData(prev => ({ ...prev, bannerImageUrl: base64 }));
        } else {
            handleProgramChange(section, 'imageUrl', base64);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProgramsPage(formData);
        setStatus('Programs page content updated successfully!');
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">Manage Programs Page</h1>
            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
                 <fieldset className="space-y-4 border p-4 rounded-md">
                    <legend className="text-xl font-semibold px-2">General</legend>
                    <ImageUpload 
                        label="Banner Image" 
                        currentImageUrl={formData.bannerImageUrl} 
                        onImageChange={(b64) => handleImageChange(b64, 'bannerImageUrl')}
                        aspect={3/1}
                    />
                </fieldset>

                {(Object.keys(formData.programs) as Array<keyof typeof formData.programs>).map(programKey => {
                    const program = formData.programs[programKey];
                    return (
                        <fieldset key={program.id} className="space-y-4 border p-4 rounded-md">
                            <legend className="text-xl font-semibold px-2 capitalize">{programKey}</legend>
                             <ImageUpload 
                                label="Program Image" 
                                currentImageUrl={program.imageUrl} 
                                onImageChange={(b64) => handleImageChange(b64, programKey)}
                                aspect={3/2}
                             />
                            <div>
                                <label htmlFor={`${program.id}-title`} className={labelClasses}>Title</label>
                                <input type="text" id={`${program.id}-title`} value={program.title} onChange={(e) => handleProgramChange(programKey, 'title', e.target.value)} className={inputClasses} />
                            </div>
                            <div>
                                <label htmlFor={`${program.id}-altText`} className={labelClasses}>Image Alt Text</label>
                                <input type="text" id={`${program.id}-altText`} value={program.altText} onChange={(e) => handleProgramChange(programKey, 'altText', e.target.value)} className={inputClasses} />
                            </div>
                            <div>
                                <label htmlFor={`${program.id}-description`} className={labelClasses}>Description</label>
                                <textarea id={`${program.id}-description`} rows={5} value={program.description} onChange={(e) => handleProgramChange(programKey, 'description', e.target.value)} className={inputClasses}></textarea>
                            </div>
                        </fieldset>
                    )
                })}

                <div>
                    <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Save Changes</button>
                    {status && <span className="ml-4 text-green-600">{status}</span>}
                </div>
            </form>
        </div>
    );
};

export default ManageProgramsPage;
