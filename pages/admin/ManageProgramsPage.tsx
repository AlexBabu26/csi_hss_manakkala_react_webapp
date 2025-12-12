
import React, { useState } from 'react';
import { useContent } from '../../hooks/useContent';
import type { ProgramsPageContent, ProgramCategory, Program } from '../../types';
import ImageUpload from '../../components/ImageUpload';
import Icon from '../../components/Icon';

const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500";
const labelClasses = "block text-sm font-medium text-zinc-700 dark:text-zinc-200";
const buttonClasses = "px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
const mobileIconButtonClasses = "md:px-4 md:py-2 px-2 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 min-w-[40px] min-h-[40px] flex items-center justify-center";

const ManageProgramsPage = () => {
    const { content, updateProgramsPage } = useContent();
    const [formData, setFormData] = useState<ProgramsPageContent>(content.programs);
    const [status, setStatus] = useState('');
    
    // Add error boundary
    if (!content || !content.programs) {
        return (
            <div className="animate-fadeIn">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">Manage Programs Page</h1>
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
                    <p>Loading programs data...</p>
                </div>
            </div>
        );
    }

    const handleCategoryChange = (categoryId: string, field: keyof ProgramCategory, value: string) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.map(cat => 
                cat.id === categoryId ? { ...cat, [field]: value } : cat
            )
        }));
    };

    const handleProgramChange = (categoryId: string, programId: string, field: keyof Program, value: string) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.map(cat => 
                cat.id === categoryId 
                    ? { 
                        ...cat, 
                        programs: cat.programs.map(prog => 
                            prog.id === programId ? { ...prog, [field]: value } : prog
                        )
                      }
                    : cat
            )
        }));
    };

    const handleBannerImageChange = (base64: string) => {
        setFormData(prev => ({ ...prev, bannerImageUrl: base64 }));
    };

    const handleProgramImageChange = (categoryId: string, programId: string, base64: string) => {
        handleProgramChange(categoryId, programId, 'imageUrl', base64);
    };

    const addCategory = () => {
        const newCategory: ProgramCategory = {
            id: Date.now().toString(),
            key: `category_${Date.now()}`,
            title: 'New Category',
            programs: []
        };
        setFormData(prev => ({ ...prev, categories: [...prev.categories, newCategory] }));
    };

    const deleteCategory = (categoryId: string) => {
        if (confirm('Are you sure you want to delete this category and all its programs?')) {
            setFormData(prev => ({
                ...prev,
                categories: prev.categories.filter(cat => cat.id !== categoryId)
            }));
        }
    };

    const addProgram = (categoryId: string) => {
        const newProgram: Program = {
            id: Date.now().toString(),
            title: 'New Program',
            description: 'Program description...',
            imageUrl: 'https://placehold.co/600x400/e0effe/333333?text=New+Program',
            altText: 'New program image'
        };
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.map(cat => 
                cat.id === categoryId 
                    ? { ...cat, programs: [...cat.programs, newProgram] }
                    : cat
            )
        }));
    };

    const deleteProgram = (categoryId: string, programId: string) => {
        if (confirm('Are you sure you want to delete this program?')) {
            setFormData(prev => ({
                ...prev,
                categories: prev.categories.map(cat => 
                    cat.id === categoryId 
                        ? { ...cat, programs: cat.programs.filter(prog => prog.id !== programId) }
                        : cat
                )
            }));
        }
    };

    const moveCategoryUp = (categoryId: string) => {
        setFormData(prev => {
            const categories = [...prev.categories];
            const index = categories.findIndex(cat => cat.id === categoryId);
            if (index > 0) {
                [categories[index - 1], categories[index]] = [categories[index], categories[index - 1]];
            }
            return { ...prev, categories };
        });
    };

    const moveCategoryDown = (categoryId: string) => {
        setFormData(prev => {
            const categories = [...prev.categories];
            const index = categories.findIndex(cat => cat.id === categoryId);
            if (index < categories.length - 1) {
                [categories[index], categories[index + 1]] = [categories[index + 1], categories[index]];
            }
            return { ...prev, categories };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProgramsPage(formData);
            setStatus('Programs page content updated successfully!');
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            setStatus('Failed to update. Please try again.');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Manage Programs Page</h1>
                <button 
                    type="button" 
                    onClick={addCategory}
                    className={`${mobileIconButtonClasses} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`}
                    title="Add Category"
                    aria-label="Add new category"
                >
                    <Icon className="w-5 h-5 md:mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </Icon>
                    <span className="hidden md:inline ml-2">Add Category</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
                {/* Banner Section */}
                <fieldset className="space-y-4 border p-4 rounded-md">
                    <legend className="text-xl font-semibold px-2">General Settings</legend>
                    <ImageUpload 
                        label="Banner Image" 
                        currentImageUrl={formData.bannerImageUrl} 
                        onImageChange={handleBannerImageChange}
                        aspect={3/1}
                    />
                </fieldset>

                {/* Categories */}
                {formData.categories.map((category, categoryIndex) => (
                    <fieldset key={category.id} className="space-y-6 border-2 border-zinc-300 dark:border-zinc-600 p-6 rounded-md">
                        <div className="flex justify-between items-start">
                            <legend className="text-xl font-semibold px-2 bg-white dark:bg-zinc-800">
                                Category {categoryIndex + 1}: {category.title}
                            </legend>
                            <div className="flex space-x-1 md:space-x-2">
                                <button 
                                    type="button" 
                                    onClick={() => moveCategoryUp(category.id)}
                                    disabled={categoryIndex === 0}
                                    className={`${mobileIconButtonClasses} bg-zinc-500 text-white hover:bg-zinc-600 focus:ring-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed`}
                                    title="Move up"
                                    aria-label="Move category up"
                                >
                                    <Icon className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                    </Icon>
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => moveCategoryDown(category.id)}
                                    disabled={categoryIndex === formData.categories.length - 1}
                                    className={`${mobileIconButtonClasses} bg-zinc-500 text-white hover:bg-zinc-600 focus:ring-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed`}
                                    title="Move down"
                                    aria-label="Move category down"
                                >
                                    <Icon className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </Icon>
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => deleteCategory(category.id)}
                                    className={`${mobileIconButtonClasses} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`}
                                    title="Delete category"
                                    aria-label="Delete category"
                                >
                                    <Icon className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </Icon>
                                </button>
                            </div>
                        </div>

                        {/* Category Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor={`category-${category.id}-title`} className={labelClasses}>Category Title</label>
                                <input 
                                    type="text" 
                                    id={`category-${category.id}-title`} 
                                    value={category.title} 
                                    onChange={(e) => handleCategoryChange(category.id, 'title', e.target.value)} 
                                    className={inputClasses} 
                                />
                            </div>
                            <div>
                                <label htmlFor={`category-${category.id}-key`} className={labelClasses}>Category Key (URL-friendly)</label>
                                <input 
                                    type="text" 
                                    id={`category-${category.id}-key`} 
                                    value={category.key} 
                                    onChange={(e) => handleCategoryChange(category.id, 'key', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))} 
                                    className={inputClasses} 
                                />
                            </div>
                        </div>

                        {/* Programs in this category */}
                        <div className="bg-zinc-50 dark:bg-zinc-700 p-4 rounded-md">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                                    Programs ({category.programs.length})
                                </h3>
                                <button 
                                    type="button" 
                                    onClick={() => addProgram(category.id)}
                                    className={`${mobileIconButtonClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`}
                                    title="Add Program"
                                    aria-label="Add new program to this category"
                                >
                                    <Icon className="w-4 h-4 md:mr-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </Icon>
                                    <span className="hidden md:inline ml-1">Add Program</span>
                                </button>
                            </div>

                            {category.programs.length === 0 ? (
                                <p className="text-zinc-500 dark:text-zinc-400 text-center py-8">
                                    No programs in this category. Click "Add Program" to get started.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {category.programs.map((program, programIndex) => (
                                        <div key={program.id} className="bg-white dark:bg-zinc-600 p-4 rounded-md border">
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="font-medium text-zinc-900 dark:text-white">
                                                    Program {programIndex + 1}: {program.title}
                                                </h4>
                                                <button 
                                                    type="button" 
                                                    onClick={() => deleteProgram(category.id, program.id)}
                                                    className={`px-2 py-2 md:px-3 md:py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 text-sm min-w-[36px] min-h-[36px] flex items-center justify-center`}
                                                    title="Delete program"
                                                    aria-label="Delete this program"
                                                >
                                                    <Icon className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </Icon>
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label htmlFor={`program-${program.id}-title`} className={labelClasses}>Program Title</label>
                                                        <input 
                                                            type="text" 
                                                            id={`program-${program.id}-title`} 
                                                            value={program.title} 
                                                            onChange={(e) => handleProgramChange(category.id, program.id, 'title', e.target.value)} 
                                                            className={inputClasses} 
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor={`program-${program.id}-altText`} className={labelClasses}>Image Alt Text</label>
                                                        <input 
                                                            type="text" 
                                                            id={`program-${program.id}-altText`} 
                                                            value={program.altText} 
                                                            onChange={(e) => handleProgramChange(category.id, program.id, 'altText', e.target.value)} 
                                                            className={inputClasses} 
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor={`program-${program.id}-description`} className={labelClasses}>Description</label>
                                                        <textarea 
                                                            id={`program-${program.id}-description`} 
                                                            rows={5} 
                                                            value={program.description} 
                                                            onChange={(e) => handleProgramChange(category.id, program.id, 'description', e.target.value)} 
                                                            className={inputClasses}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <ImageUpload 
                                                        label="Program Image" 
                                                        currentImageUrl={program.imageUrl} 
                                                        onImageChange={(base64) => handleProgramImageChange(category.id, program.id, base64)}
                                                        aspect={3/2}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </fieldset>
                ))}

                {formData.categories.length === 0 && (
                    <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-700 rounded-lg">
                        <p className="text-zinc-500 dark:text-zinc-400 mb-4">No program categories yet.</p>
                        <button 
                            type="button" 
                            onClick={addCategory}
                            className={`${buttonClasses} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`}
                        >
                            <Icon className="w-5 h-5 inline mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </Icon>
                            Create Your First Category
                        </button>
                    </div>
                )}

                <div className="pt-6 border-t">
                    <button type="submit" className={`${mobileIconButtonClasses} bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 mr-4`} title="Save All Changes" aria-label="Save all changes">
                        <Icon className="w-5 h-5 md:mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </Icon>
                        <span className="hidden md:inline ml-2">Save All Changes</span>
                    </button>
                    {status && <span className="text-green-600 font-medium">{status}</span>}
                </div>
            </form>
        </div>
    );
};

export default ManageProgramsPage;