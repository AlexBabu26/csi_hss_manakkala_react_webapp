import React from 'react';
import { useAccessibility } from '../hooks/useAccessibility';
import Accordion, { AccordionItem } from '../components/Accordion';
import { Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';

const ProcessStep: React.FC<{ number: number; title: string; description: string; }> = ({ number, title, description }) => {
    return (
        <div className="flex">
            <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-600 text-white font-bold text-xl">
                    {number}
                </div>
            </div>
            <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{title}</h3>
                <p className="mt-1 text-zinc-600 dark:text-zinc-300">{description}</p>
            </div>
        </div>
    );
}

const AdmissionsPage = () => {
    const { preferences } = useAccessibility();
    const { content } = useContent();
    const { bannerImageUrl, tuitionInfo, faqs } = content.admissions;
    const fadeInClass = preferences.motion === 'reduced' ? '' : 'animate-fadeIn';

    return (
        <div className={fadeInClass}>
            <section className="relative h-64 md:h-80 bg-primary-700">
                <img 
                    src={bannerImageUrl} 
                    alt="A welcoming entrance to the Inclusive Learning Hub with a sign that reads 'Welcome'." 
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white text-center px-4">Admissions</h1>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-4xl mx-auto">
                    
                    <section aria-labelledby="process-heading" className="mb-16">
                        <h2 id="process-heading" className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-10">Our Admissions Process</h2>
                        <div className="space-y-8">
                            <ProcessStep number={1} title="Inquiry" description="Contact our admissions office to learn more about our school and programs. We're happy to answer your initial questions."/>
                            <ProcessStep number={2} title="School Tour" description="Schedule a virtual or in-person tour to see our facilities and meet some of our staff."/>
                            <ProcessStep number={3} title="Application" description="Complete and submit the online application form along with the required documents, including previous school records and evaluations."/>
                            <ProcessStep number={4} title="Student Assessment" description="We conduct a friendly and informal assessment to understand your child's unique strengths and learning style."/>
                             <ProcessStep number={5} title="Admissions Decision" description="Our admissions committee carefully reviews each application, and decisions are communicated within two weeks of the assessment."/>
                        </div>
                    </section>

                    <section aria-labelledby="tuition-heading" className="mb-16 bg-zinc-50 dark:bg-zinc-800 p-8 rounded-lg">
                         <h2 id="tuition-heading" className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-6">Tuition & Financial Aid</h2>
                         <p className="text-center text-lg text-zinc-700 dark:text-zinc-200 mb-6">
                            {tuitionInfo}
                         </p>
                         <div className="text-center">
                            <Link to="/contact" className="inline-block bg-primary-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-50 dark:focus:ring-offset-zinc-800 focus:ring-primary-500">
                                Contact Us for Details
                            </Link>
                         </div>
                    </section>
                    
                    <section aria-labelledby="faq-heading">
                         <h2 id="faq-heading" className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-10">Frequently Asked Questions</h2>
                         <Accordion>
                            {faqs.map(faq => (
                                <AccordionItem key={faq.id} title={faq.question}>
                                    <p>{faq.answer}</p>
                                </AccordionItem>
                            ))}
                         </Accordion>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default AdmissionsPage;