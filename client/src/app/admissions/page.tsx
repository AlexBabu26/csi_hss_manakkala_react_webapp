import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admissions | CSI HSS For The Partially Hearing',
  description: 'Information regarding our admission process, requirements, age criteria, and enrollment for students with partial hearing.',
};

export default function Admissions() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in motion-reduce:animate-none">
      <div className="max-w-4xl mx-auto text-center mb-16">
        {/* Bold Typography & Balance */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-zinc-900 dark:text-hc-text mb-6 tracking-tight [text-wrap:balance]">
          Admissions
        </h1>
        <p className="text-xl text-zinc-700 dark:text-zinc-300 [text-wrap:balance]">
          We welcome students who can benefit from our specialized educational environment. Below is the information regarding our admission process and requirements.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Admissions Process List Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-hc-text mb-10 [text-wrap:balance]">Our Admissions Process</h2>
          <div className="space-y-6">
            {[
              { title: "Inquiry", desc: "Contact our admissions office to learn more about our school and programs. We're happy to answer your initial questions." },
              { title: "School Tour", desc: "Schedule a virtual or in-person tour to see our facilities and meet some of our staff." },
              { title: "Application", desc: "Complete and submit the online application form along with the required documents, including previous school records and evaluations." },
              { title: "Student Assessment", desc: "We conduct a friendly and informal assessment to understand your child's unique strengths and learning style." },
              { title: "Admissions Decision", desc: "Our admissions committee carefully reviews each application, and decisions are communicated within two weeks of the assessment." },
            ].map((step, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 dark:bg-hc-interactive text-white dark:text-hc-bg flex items-center justify-center font-bold text-lg" aria-hidden="true">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-zinc-700 dark:text-zinc-300 text-lg">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bento Grid Layout for Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[minmax(200px,auto)] mb-16">
          {/* Tuition & Financial Aid Card */}
          <section className="md:col-span-2 bg-zinc-50 dark:bg-zinc-800 p-10 rounded-3xl border border-zinc-200 dark:border-zinc-700 text-center flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-hc-interactive mb-4 [text-wrap:balance]">Tuition & Financial Aid</h2>
            <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-8 max-w-2xl">
              Our admission process is tailored to the needs of our students and does not follow the Single Window system. For details on admission procedures, tuition, and fees, please contact the school office.
            </p>
            <Link 
              href="/contact" 
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white dark:bg-hc-interactive dark:hover:bg-hc-accent dark:text-hc-bg px-8 py-3 rounded-full font-bold text-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-primary-500 transition-colors"
            >
              Contact Us for Details
            </Link>
          </section>

          {/* FAQ Card */}
          <section className="md:col-span-2 bg-white dark:bg-zinc-800 p-10 rounded-3xl border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-hc-interactive mb-8 [text-wrap:balance]">Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {[
                "When does admission for LKG to Class X begin?",
                "When can we apply for Plus One (Higher Secondary)?",
                "What teaching method is used?"
              ].map((q, i) => (
                <details key={i} className="group border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                  <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-zinc-900 dark:text-white">
                    {q}
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="border-t border-zinc-200 dark:border-zinc-700 p-4 text-zinc-700 dark:text-zinc-300">
                    {/* Placeholder content for FAQ */}
                    <p>Please contact the school office for specific details regarding this question, as our dates and methods may be tailored to individual student needs.</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
