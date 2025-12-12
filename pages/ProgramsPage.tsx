import React, { useState } from 'react';
import { useAccessibility } from '../hooks/useAccessibility';
import { useContent } from '../hooks/useContent';
import { uploadAPI } from '../lib/api';
import type { Program } from '../types';

const ProgramCard: React.FC<{ program: Program }> = ({ program }) => {
    // Get proxied image URL for secure access
    const imageUrl = uploadAPI.getProxiedImageUrl(program.imageUrl);
    
    return (
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="aspect-[3/2] overflow-hidden">
                <img 
                    src={imageUrl} 
                    alt={program.altText} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-primary-700 dark:text-hc-interactive mb-3">
                    {program.title}
                </h3>
                <p className="text-zinc-700 dark:text-zinc-200 leading-relaxed">
                    {program.description}
                </p>
            </div>
        </div>
    );
};

const ProgramsPage = () => {
    const { preferences } = useAccessibility();
    const { content } = useContent();
    
    // Add error boundary and defensive programming
    if (!content || !content.programs) {
        console.log('Content loading or missing:', { content: !!content, programs: !!content?.programs });
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Loading Programs...</h1>
                <p>Please wait while we load the programs content.</p>
            </div>
        );
    }
    
    const { bannerImageUrl, categories } = content.programs;
    console.log('Programs data loaded:', { categoriesCount: categories?.length, bannerImageUrl });
    const fadeInClass = preferences.motion === 'reduced' ? '' : 'animate-fadeIn';
    
    // Set active tab to first category or empty string if no categories
    const [activeTab, setActiveTab] = useState<string>(categories?.[0]?.key || '');

    // Update active tab if categories change and current tab is not available
    React.useEffect(() => {
        if (categories && categories.length > 0) {
            if (!categories.find(cat => cat.key === activeTab)) {
                setActiveTab(categories[0].key);
            }
        }
    }, [categories, activeTab]);

    const tabButtonClasses = "flex-1 py-3 px-2 text-center border-b-2 font-semibold focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-hc-interactive rounded-t-md transition-colors duration-200";
    const activeTabClasses = "border-primary-600 dark:border-hc-interactive text-primary-600 dark:text-hc-interactive bg-primary-50 dark:bg-zinc-700";
    const inactiveTabClasses = "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:border-zinc-500";
    
    // Get proxied banner image URL
    const bannerImageUrlProxied = uploadAPI.getProxiedImageUrl(bannerImageUrl);
    
    return (
         <div className={fadeInClass}>
            {/* Banner Section */}
            <section className="relative h-64 md:h-80 bg-primary-700">
                <img 
                    src={bannerImageUrlProxied} 
                    alt="A teacher guiding a student with a hands-on learning activity in a classroom." 
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white text-center px-4">Our Programs</h1>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-6xl mx-auto">
                    {!categories || categories.length === 0 ? (
                        <div className="text-center py-16">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                                No Program Categories Available
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-300">
                                Program categories will be displayed here once they are added by the administrator.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Tab Navigation */}
                            <div className="mb-8" role="tablist" aria-label="Our Programs">
                                <div className="flex flex-wrap border-b border-zinc-200 dark:border-zinc-600">
                                    {categories.map(category => (
                                        <button 
                                            key={category.id}
                                            onClick={() => setActiveTab(category.key)} 
                                            role="tab" 
                                            aria-selected={activeTab === category.key} 
                                            aria-controls={`${category.key}-panel`} 
                                            className={`${tabButtonClasses} ${activeTab === category.key ? activeTabClasses : inactiveTabClasses}`}
                                        >
                                            {category.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Tab Content */}
                            <div className="mt-8">
                                {categories.map(category => (
                                    activeTab === category.key && (
                                        <div 
                                            key={category.id}
                                            id={`${category.key}-panel`} 
                                            role="tabpanel" 
                                            aria-labelledby={`${category.key}-tab`}
                                            className="animate-fadeIn"
                                        >
                                            {category.programs.length === 0 ? (
                                                <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                                                        No Programs Available
                                                    </h3>
                                                    <p className="text-zinc-600 dark:text-zinc-300">
                                                        Programs in {category.title} will be displayed here once they are added.
                                                    </p>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Category Introduction */}
                                                    <div className="text-center mb-12">
                                                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                                                            {category.title}
                                                        </h2>
                                                        <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto">
                                                            Explore our {category.title.toLowerCase()} offerings designed to support and empower our students.
                                                        </p>
                                                    </div>

                                                    {/* Programs Grid */}
                                                    {category.programs.length === 1 ? (
                                                        // Single program - full width display
                                                        <div className="max-w-4xl mx-auto">
                                                            <div className="md:grid md:grid-cols-2 md:gap-8 items-center bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
                                                                <div className="p-8">
                                                                    <h3 className="text-2xl font-bold text-primary-700 dark:text-hc-interactive mb-4">
                                                                        {category.programs[0].title}
                                                                    </h3>
                                                                    <div className="space-y-4 text-lg text-zinc-700 dark:text-zinc-200">
                                                                        <p>{category.programs[0].description}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="aspect-[3/2] md:aspect-auto md:h-full">
                                                                    <img 
                                                                        src={uploadAPI.getProxiedImageUrl(category.programs[0].imageUrl)} 
                                                                        alt={category.programs[0].altText} 
                                                                        className="w-full h-full object-cover" 
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        // Multiple programs - card grid
                                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                                            {category.programs.map(program => (
                                                                <ProgramCard key={program.id} program={program} />
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProgramsPage;