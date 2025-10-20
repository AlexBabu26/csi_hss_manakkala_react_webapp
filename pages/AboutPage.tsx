import React from 'react';
import { useAccessibility } from '../hooks/useAccessibility';
import { useContent } from '../hooks/useContent';

const LeadershipCard: React.FC<{ name: string; title: string; imageUrl: string }> = ({ name, title, imageUrl }) => {
    return (
        <div className="text-center">
            <img 
                src={imageUrl} 
                alt={`Headshot of ${name}, ${title}`} 
                className="w-40 h-40 rounded-full mx-auto mb-4 object-cover shadow-lg"
            />
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{name}</h3>
            <p className="text-primary-700 dark:text-hc-interactive">{title}</p>
        </div>
    );
};

const FacilityImage: React.FC<{ src: string; alt: string; caption: string }> = ({ src, alt, caption }) => {
     const { preferences } = useAccessibility();
    const reducedMotionClass = preferences.motion === 'reduced' ? '' : 'transition-transform duration-300 transform hover:scale-105';

    return (
        <figure>
            <img 
                src={src} 
                alt={alt}
                className={`w-full h-64 object-cover rounded-lg shadow-md ${reducedMotionClass}`}
            />
            <figcaption className="mt-2 text-center text-zinc-600 dark:text-zinc-300">{caption}</figcaption>
        </figure>
    );
}

const AboutPage = () => {
    const { preferences } = useAccessibility();
    const { content } = useContent();
    const { bannerImageUrl, mission, philosophy, leadership, facilities } = content.about;
    const fadeInClass = preferences.motion === 'reduced' ? '' : 'animate-fadeIn';

    return (
        <div className={fadeInClass}>
            <div className="relative h-64 md:h-80">
                 <img 
                    src={bannerImageUrl} 
                    alt="A bright, sunny day on the Inclusive Learning Hub campus with green lawns and modern buildings." 
                    className="w-full h-full object-cover"
                />
                 <div className="absolute inset-0 bg-primary-800 opacity-50"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                     <h1 className="text-4xl md:text-6xl font-extrabold text-white text-center px-4">About Our School</h1>
                 </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-12 text-lg text-zinc-700 dark:text-zinc-200">
                        <section aria-labelledby="mission-heading">
                            <h2 id="mission-heading" className="text-3xl font-bold text-primary-700 dark:text-hc-interactive mb-4">Our Mission</h2>
                            <p>
                                {mission}
                            </p>
                        </section>

                        <section aria-labelledby="philosophy-heading">
                            <h2 id="philosophy-heading" className="text-3xl font-bold text-primary-700 dark:text-hc-interactive mb-4">Our Philosophy</h2>
                            <p>
                                {philosophy}
                            </p>
                        </section>

                         <section aria-labelledby="leadership-heading">
                            <h2 id="leadership-heading" className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-8">Meet Our Leadership</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                                {leadership.map(person => (
                                    <LeadershipCard key={person.id} name={person.name} title={person.title} imageUrl={person.imageUrl} />
                                ))}
                            </div>
                        </section>

                         <section aria-labelledby="facilities-heading">
                             <h2 id="facilities-heading" className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-8">Our Facilities</h2>
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {facilities.map(facility => (
                                    <FacilityImage key={facility.id} src={facility.imageUrl} alt={facility.altText} caption={facility.caption} />
                                ))}
                             </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;