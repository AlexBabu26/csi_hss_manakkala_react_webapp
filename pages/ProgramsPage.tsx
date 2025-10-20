import React, { useState } from 'react';
import { useAccessibility } from '../hooks/useAccessibility';
import { useContent } from '../hooks/useContent';

type ProgramTab = 'academics' | 'therapeutics' | 'arts' | 'skills';

const TabContent: React.FC<{ title: string; imageUrl: string; altText: string; children: React.ReactNode }> = ({ title, imageUrl, altText, children }) => (
    <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
        <div>
            <h3 className="text-2xl font-bold text-primary-700 dark:text-hc-interactive mb-4">{title}</h3>
            <div className="space-y-4 text-lg text-zinc-700 dark:text-zinc-200">
                {children}
            </div>
        </div>
        <div className="mt-8 md:mt-0">
            <img src={imageUrl} alt={altText} className="rounded-lg shadow-lg w-full h-auto object-cover" />
        </div>
    </div>
);


const ProgramsPage = () => {
    const { preferences } = useAccessibility();
    const { content } = useContent();
    const { bannerImageUrl, programs } = content.programs;
    const fadeInClass = preferences.motion === 'reduced' ? '' : 'animate-fadeIn';
    const [activeTab, setActiveTab] = useState<ProgramTab>('academics');

    const tabButtonClasses = "flex-1 py-3 px-2 text-center border-b-2 font-semibold focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-hc-interactive rounded-t-md";
    const activeTabClasses = "border-primary-600 dark:border-hc-interactive text-primary-600 dark:text-hc-interactive bg-primary-50 dark:bg-zinc-700";
    const inactiveTabClasses = "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:border-zinc-500";
    
    return (
         <div className={fadeInClass}>
            <section className="relative h-64 md:h-80 bg-primary-700">
                <img 
                    src={bannerImageUrl} 
                    alt="A teacher guiding a student with a hands-on learning activity in a classroom." 
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white text-center px-4">Our Programs</h1>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                 <div className="max-w-5xl mx-auto">
                    <div className="mb-8" role="tablist" aria-label="Our Programs">
                        <div className="flex flex-wrap border-b border-zinc-200 dark:border-zinc-600">
                             <button onClick={() => setActiveTab('academics')} role="tab" aria-selected={activeTab === 'academics'} aria-controls="academics-panel" className={`${tabButtonClasses} ${activeTab === 'academics' ? activeTabClasses : inactiveTabClasses}`}>
                                Academics
                            </button>
                             <button onClick={() => setActiveTab('therapeutics')} role="tab" aria-selected={activeTab === 'therapeutics'} aria-controls="therapeutics-panel" className={`${tabButtonClasses} ${activeTab === 'therapeutics' ? activeTabClasses : inactiveTabClasses}`}>
                                Therapeutic Services
                            </button>
                            <button onClick={() => setActiveTab('arts')} role="tab" aria-selected={activeTab === 'arts'} aria-controls="arts-panel" className={`${tabButtonClasses} ${activeTab === 'arts' ? activeTabClasses : inactiveTabClasses}`}>
                                Arts & Music
                            </button>
                            <button onClick={() => setActiveTab('skills')} role="tab" aria-selected={activeTab === 'skills'} aria-controls="skills-panel" className={`${tabButtonClasses} ${activeTab === 'skills' ? activeTabClasses : inactiveTabClasses}`}>
                                Life Skills
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-8">
                        {activeTab === 'academics' && (
                           <div id="academics-panel" role="tabpanel" aria-labelledby="academics-tab">
                               <TabContent title={programs.academics.title} imageUrl={programs.academics.imageUrl} altText={programs.academics.altText}>
                                  <p>{programs.academics.description}</p>
                               </TabContent>
                           </div>
                        )}
                        {activeTab === 'therapeutics' && (
                           <div id="therapeutics-panel" role="tabpanel" aria-labelledby="therapeutics-tab">
                               <TabContent title={programs.therapeutics.title} imageUrl={programs.therapeutics.imageUrl} altText={programs.therapeutics.altText}>
                                  <p>{programs.therapeutics.description}</p>
                               </TabContent>
                           </div>
                        )}
                         {activeTab === 'arts' && (
                           <div id="arts-panel" role="tabpanel" aria-labelledby="arts-tab">
                               <TabContent title={programs.arts.title} imageUrl={programs.arts.imageUrl} altText={programs.arts.altText}>
                                  <p>{programs.arts.description}</p>
                               </TabContent>
                           </div>
                        )}
                         {activeTab === 'skills' && (
                           <div id="skills-panel" role="tabpanel" aria-labelledby="skills-tab">
                               <TabContent title={programs.skills.title} imageUrl={programs.skills.imageUrl} altText={programs.skills.altText}>
                                  <p>{programs.skills.description}</p>
                               </TabContent>
                           </div>
                        )}
                    </div>
                 </div>
            </div>
         </div>
    );
};

export default ProgramsPage;