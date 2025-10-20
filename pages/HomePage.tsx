import React from 'react';
import { Link } from 'react-router-dom';
import { useAccessibility } from '../hooks/useAccessibility';
import { useContent } from '../hooks/useContent';
import Icon from '../components/Icon';
import ImageSlider from '../components/ImageSlider';

const Feature: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => {
    const getIcon = () => {
        switch(icon) {
            case 'AcademicCapIcon':
                return <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5z" />;
            case 'HeartIcon':
                return <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />;
            case 'UserGroupIcon':
                return <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3.75 3.75 0 019 10.5V9A4.5 4.5 0 0113.5 4.5v.75m-6.75 6.75a3.75 3.75 0 00-3.75 3.75V18a3 3 0 00.479 1.623m7.021-7.021A3.75 3.75 0 009 10.5V9a4.5 4.5 0 014.5-4.5v.75m-6.75 6.75V18a3.75 3.75 0 003.75 3.75h.75A3.75 3.75 0 0015 18v-3.75a3.75 3.75 0 00-3.75-3.75H9.75z" />;
            default:
                return null;
        }
    }
    return (
        <div className="text-center p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 mx-auto mb-4">
                <Icon className="w-8 h-8">{getIcon()}</Icon>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{title}</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">{description}</p>
        </div>
    );
};

const Testimonial: React.FC<{ quote: string; name: string; role: string; imageUrl: string }> = ({ quote, name, role, imageUrl }) => (
    <div className="bg-primary-50 dark:bg-zinc-800 p-8 rounded-lg shadow-lg text-center">
        <img src={imageUrl} alt={`Portrait of ${name}`} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white dark:border-zinc-700" />
        <blockquote className="text-lg italic text-zinc-700 dark:text-zinc-200">"{quote}"</blockquote>
        <cite className="block mt-4 not-italic">
            <span className="font-bold text-zinc-900 dark:text-white">{name}</span>
            <br />
            <span className="text-primary-700 dark:text-hc-interactive">{role}</span>
        </cite>
    </div>
);

const EventCard: React.FC<{ event: import('../types').Event }> = ({ event }) => {
  const { preferences } = useAccessibility();
  const reducedMotionClass = preferences.motion === 'reduced' ? '' : 'transition-transform duration-300 transform hover:scale-105';
  
  return (
    <div className={`bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden ${reducedMotionClass}`}>
      <div className="h-56">
        <ImageSlider images={event.images.map(img => ({ src: img, alt: `Image for ${event.title}`}))} />
      </div>
      <div className="p-6">
        <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h3 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">{event.title}</h3>
        <p className="mt-3 text-base text-zinc-600 dark:text-zinc-300">{event.description}</p>
      </div>
    </div>
  )
}

const HomePage = () => {
    const { preferences } = useAccessibility();
    const { content } = useContent();
    const { hero, features, testimonials } = content.home;
    const { events } = content;
    const fadeInClass = preferences.motion === 'reduced' ? '' : 'animate-fadeIn';
    
    return (
        <div className={fadeInClass}>
            {/* Hero Section */}
            <section className="relative bg-primary-700 text-white h-[60vh] min-h-[400px] flex items-center justify-center text-center">
                <img src={hero.imageUrl} alt="A diverse group of students working together in a bright classroom" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                <div className="relative z-10 p-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">{hero.heading}</h1>
                    <p className="mt-4 text-lg md:text-2xl max-w-3xl mx-auto drop-shadow-md">{hero.subheading}</p>
                    <Link to="/admissions" className="mt-8 inline-block bg-white dark:bg-hc-interactive text-primary-700 dark:text-hc-bg font-bold py-3 px-8 rounded-full text-lg hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-700 focus:ring-white">
                        Learn More
                    </Link>
                </div>
            </section>
            
            {/* Features Section */}
            <section className="py-16 bg-zinc-50 dark:bg-zinc-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-12">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map(feature => <Feature key={feature.id} {...feature} />)}
                    </div>
                </div>
            </section>
            
            {/* Testimonials Section */}
            <section className="py-16 bg-white dark:bg-zinc-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-12">What Our Community Says</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {testimonials.map(testimonial => <Testimonial key={testimonial.id} {...testimonial} />)}
                    </div>
                </div>
            </section>
            
            {/* Events Section */}
            <section className="py-16 bg-zinc-50 dark:bg-zinc-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-12">Upcoming Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {events.slice(0, 2).map(event => <EventCard key={event.id} event={event} />)}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default HomePage;
