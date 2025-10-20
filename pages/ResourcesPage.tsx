import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { useAccessibility } from '../hooks/useAccessibility';

const ResourceCard: React.FC<{ to: string; title: string; children: React.ReactNode; description: string }> = ({ to, title, children, description }) => {
    const { preferences } = useAccessibility();
    const reducedMotionClass = preferences.motion === 'reduced' ? '' : 'transition-transform duration-300 transform hover:-translate-y-2';
    
    return (
        <Link to={to} className={`block p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-hc-interactive h-full flex flex-col ${reducedMotionClass}`}>
            <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 mb-4">
                {children}
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{title}</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300 flex-grow">{description}</p>
        </Link>
    );
};


const ResourcesPage = () => {
    const { preferences } = useAccessibility();
    const fadeInClass = preferences.motion === 'reduced' ? '' : 'animate-fadeIn';

    return (
        <div className={fadeInClass}>
            <section className="relative h-64 md:h-80 bg-primary-700">
                <img 
                    src="https://placehold.co/1200x400/468eef/FFFFFF?text=Resource+Center" 
                    alt="A well-organized library with comfortable seating areas." 
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white text-center px-4">Parent & Student Resources</h1>
                </div>
            </section>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                 <p className="text-center text-xl max-w-3xl mx-auto mb-12 text-zinc-600 dark:text-zinc-300">
                    Find important documents, guides, and links to support your family's journey at the Inclusive Learning Hub.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <ResourceCard to="#" title="Parent Handbook" description="Your complete guide to our school's policies, procedures, and community expectations.">
                        <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></Icon>
                    </ResourceCard>
                     <ResourceCard to="#" title="School Calendar" description="Stay up-to-date with all important dates, including holidays, parent-teacher conferences, and school events.">
                        <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" /></Icon>
                    </ResourceCard>
                    <ResourceCard to="#" title="IEP Resources" description="Information and guides to help you understand and participate in the Individualized Education Program process.">
                        <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></Icon>
                    </ResourceCard>
                    <ResourceCard to="#" title="Lunch Menu" description="View the monthly lunch menu, including nutritional information and options for dietary restrictions.">
                        <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" /></Icon>
                    </ResourceCard>
                    <ResourceCard to="#" title="Technology Support" description="Get help with school-issued devices, software, and online learning platforms.">
                         <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.97-2.122L7.5 4.5M9 17.25v-13.5M9 17.25c0 .621.504 1.125 1.125 1.125h3.75c.621 0 1.125-.504 1.125-1.125v-1.007a3 3 0 0 1-.97 2.122L16.5 4.5m-7.5 12.75h7.5" /></Icon>
                    </ResourceCard>
                    <ResourceCard to="#" title="Community Support" description="A list of local and national organizations that provide support and resources for families and individuals with disabilities.">
                        <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962A3.75 3.75 0 0 1 9 10.5V9A4.5 4.5 0 0 1 13.5 4.5v.75m-6.75 6.75a3.75 3.75 0 0 0-3.75 3.75V18a3 3 0 0 0 .479 1.623m7.021-7.021A3.75 3.75 0 0 0 9 10.5V9a4.5 4.5 0 0 1 4.5-4.5v.75m-6.75 6.75V18a3.75 3.75 0 0 0 3.75 3.75h.75A3.75 3.75 0 0 0 15 18v-3.75a3.75 3.75 0 0 0-3.75-3.75H9.75Z" /></Icon>
                    </ResourceCard>
                 </div>
            </div>
        </div>
    );
};

export default ResourcesPage;