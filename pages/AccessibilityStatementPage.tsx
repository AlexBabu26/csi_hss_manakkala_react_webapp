
import React from 'react';
import { useAccessibility } from '../hooks/useAccessibility';

const AccessibilityStatementPage = () => {
    const { preferences } = useAccessibility();
    const fadeInClass = preferences.motion === 'reduced' ? '' : 'animate-fadeIn';

    return (
        <div className={fadeInClass}>
            <section className="bg-primary-50 dark:bg-zinc-900 py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white text-center">Accessibility Statement</h1>
                </div>
            </section>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-4xl mx-auto space-y-8 text-lg text-zinc-700 dark:text-zinc-200">
                    <section aria-labelledby="commitment-heading">
                        <h2 id="commitment-heading" className="text-2xl font-bold text-primary-700 dark:text-hc-interactive mb-4">Our Commitment</h2>
                        <p>
                            C.S.I. HSS For The Partially Hearing, Manakala is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
                        </p>
                    </section>

                    <section aria-labelledby="status-heading">
                        <h2 id="status-heading" className="text-2xl font-bold text-primary-700 dark:text-hc-interactive mb-4">Conformance Status</h2>
                        <p>
                            The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
                        </p>
                        <p className="mt-4">
                            Our website is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard. We are actively working to achieve full conformance.
                        </p>
                    </section>

                    <section aria-labelledby="feedback-heading">
                        <h2 id="feedback-heading" className="text-2xl font-bold text-primary-700 dark:text-hc-interactive mb-4">Feedback</h2>
                        <p>
                            We welcome your feedback on the accessibility of our website. Please let us know if you encounter accessibility barriers:
                        </p>
                        <ul className="list-disc list-inside mt-4 space-y-2">
                            <li>Phone: <a href="tel:04734230461" className="underline hover:text-primary-600">04734 230461</a></li>
                            <li>E-mail: <a href="mailto:csihssphmanakala@gmail.com" className="underline hover:text-primary-600">csihssphmanakala@gmail.com</a></li>
                            <li>Visitor Address: C.S.I. HSS for the partially Hearing, Manakala P.O, Adoor, Pathanamthitta (Dist), Kerala - 691551</li>
                        </ul>
                         <p className="mt-4">We try to respond to feedback within 5 business days.</p>
                    </section>
                    
                    <section aria-labelledby="tech-heading">
                         <h2 id="tech-heading" className="text-2xl font-bold text-primary-700 dark:text-hc-interactive mb-4">Technical Specifications</h2>
                         <p>
                            Accessibility of this website relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:
                         </p>
                         <ul className="list-disc list-inside mt-4 space-y-2">
                            <li>HTML</li>
                            <li>WAI-ARIA</li>
                            <li>CSS</li>
                            <li>JavaScript</li>
                         </ul>
                         <p className="mt-4">These technologies are relied upon for conformance with the accessibility standards used.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AccessibilityStatementPage;
