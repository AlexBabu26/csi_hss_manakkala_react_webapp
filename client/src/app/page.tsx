import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'CSI HSS For The Partially Hearing, Manakala',
  description: 'Providing accessible, inclusive, and high-quality education to help every student reach their full potential. Located in Manakala, Adoor.',
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Full-Screen Hero Section */}
      <section className="relative flex items-center justify-center min-h-[85vh] bg-primary-900 dark:bg-hc-bg dark:border-b dark:border-hc-accent px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background pattern or image overlay placeholder */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="container relative z-10 mx-auto max-w-5xl text-center animate-fade-in motion-reduce:animate-none">
          
          {/* Two Logos */}
          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white overflow-hidden">
              {/* Replace with actual logo image path */}
              <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-xs text-zinc-500 text-center p-2">School Logo</div>
            </div>
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-primary-800 rounded-full flex items-center justify-center shadow-lg border-4 border-primary-800 overflow-hidden">
              {/* Replace with actual logo image path */}
              <div className="w-full h-full bg-primary-800 flex items-center justify-center text-xs text-primary-200 text-center p-2">Hearing Logo</div>
            </div>
          </div>

          {/* Bold Typography & Text Balance */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white dark:text-hc-text mb-6 tracking-tight [text-wrap:balance]">
            C.S.I. HSS For The Partially Hearing, Manakala
          </h1>
          <p className="text-xl sm:text-2xl text-primary-100 dark:text-zinc-300 mb-10 max-w-3xl mx-auto [text-wrap:balance]">
            Established in 1981, we provide a supportive and engaging environment, empowering students with hearing impairments through quality education.
          </p>
          <div className="flex justify-center">
            <Link 
              href="/about" 
              className="bg-white text-primary-900 hover:bg-zinc-100 dark:bg-hc-interactive dark:hover:bg-hc-accent dark:text-hc-bg px-8 py-3 rounded-full font-bold text-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-primary-500 transition-colors shadow-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Grid layout for Why Choose Us? */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-900">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-extrabold text-center text-zinc-900 dark:text-hc-text mb-12 [text-wrap:balance]">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
            <div className="p-8 bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-700 flex flex-col h-full hover:shadow-md transition-shadow text-center items-center">
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-6 text-2xl" aria-hidden="true">
                🎓
              </div>
              <h3 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-hc-interactive">Total Communication</h3>
              <p className="text-zinc-600 dark:text-zinc-300 text-lg flex-grow">
                Our teaching-learning process uses the total communication method to ensure effective understanding and expression.
              </p>
            </div>
            <div className="p-8 bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-700 flex flex-col h-full hover:shadow-md transition-shadow text-center items-center">
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-6 text-2xl" aria-hidden="true">
                ❤️
              </div>
              <h3 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-hc-interactive">SCERT Certified Syllabus</h3>
              <p className="text-zinc-600 dark:text-zinc-300 text-lg flex-grow">
                We follow the same SCERT syllabus used by Government and Aided schools, ensuring a high standard of education.
              </p>
            </div>
            <div className="p-8 bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-700 flex flex-col h-full hover:shadow-md transition-shadow text-center items-center">
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-6 text-2xl" aria-hidden="true">
                🌟
              </div>
              <h3 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-hc-interactive">Holistic Development</h3>
              <p className="text-zinc-600 dark:text-zinc-300 text-lg flex-grow">
                With separate hostels for boys and girls and a focus on extracurriculars, we ensure overall development and satisfaction in life.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
