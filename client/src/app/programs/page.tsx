import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Programs | CSI HSS For The Partially Hearing',
  description: 'Explore our specialized academic curriculums, speech & language therapy, and vocational training programs.',
};

export default function Programs() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in motion-reduce:animate-none">
      <div className="max-w-6xl mx-auto text-center mb-12">
        {/* Bold Typography & Balance */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-zinc-900 dark:text-hc-text mb-6 tracking-tight [text-wrap:balance]">
          Our Programs
        </h1>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Bento Grid Layout - Academic Programs */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4 [text-wrap:balance]">Academic Programs</h2>
            <p className="text-lg text-zinc-700 dark:text-zinc-300 [text-wrap:balance]">Explore our academic programs offerings designed to support and empower our students.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white dark:bg-zinc-800 rounded-3xl border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden flex flex-col">
              <div className="h-64 bg-zinc-200 w-full flex items-center justify-center text-zinc-500">Classroom Image</div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-primary-700 dark:text-hc-interactive mb-4 [text-wrap:balance]">Higher Secondary Courses</h3>
                <p className="text-lg text-zinc-700 dark:text-zinc-300">
                  We offer Science (English, Malayalam, Physics, Chemistry, Mathematics, Computer Science) and Commerce (English, Malayalam, Accountancy with Computerised Accounting, Business Studies, Economics, Computer Application) batches for higher secondary students.
                </p>
              </div>
            </section>

            <section className="bg-white dark:bg-zinc-800 rounded-3xl border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden flex flex-col">
              <div className="h-64 bg-zinc-200 w-full flex items-center justify-center text-zinc-500">Classroom Image</div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-primary-700 dark:text-hc-interactive mb-4 [text-wrap:balance]">LKG and High School</h3>
                <p className="text-lg text-zinc-700 dark:text-zinc-300">
                  Admission to classes from LKG to X starts from the Month of May. The school uses total communication for teaching learning process. The school provides speech therapy for improving the speech and language for the children with communication disorder. Also conduct speech class on vacation period.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Bento Grid Layout - Other Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
          {/* Therapeutic Services */}
          <section className="md:col-span-3 lg:col-span-2 bg-primary-50 dark:bg-zinc-800 rounded-3xl border border-primary-100 dark:border-zinc-700 flex flex-col sm:flex-row overflow-hidden">
             <div className="p-8 flex-1 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-primary-800 dark:text-hc-interactive mb-4 [text-wrap:balance]">Therapeutic Services</h2>
              <p className="text-lg text-zinc-800 dark:text-zinc-300 mb-6">
                Explore our therapeutic services offerings designed to support and empower our students.
              </p>
              <h3 className="text-2xl font-bold text-primary-700 dark:text-hc-interactive mb-3">Speech Therapy</h3>
              <p className="text-zinc-700 dark:text-zinc-300 text-lg">
                The school provides dedicated speech therapy to improve the speech and language for children with communication disorders. Speech classes are also conducted during vacation periods.
              </p>
            </div>
            <div className="w-full sm:w-2/5 bg-zinc-200 min-h-[250px] flex items-center justify-center text-zinc-500">
              Therapy Image
            </div>
          </section>

          {/* Arts & Extra-Curricular */}
          <section className="bg-zinc-50 dark:bg-zinc-800 rounded-3xl border border-zinc-200 dark:border-zinc-700 overflow-hidden flex flex-col">
            <div className="h-48 bg-zinc-200 w-full flex items-center justify-center text-zinc-500">Activity Image</div>
            <div className="p-8 flex-1 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-primary-700 dark:text-hc-interactive mb-3 [text-wrap:balance]">Arts & Extra-Curricular</h2>
              <p className="text-lg text-zinc-700 dark:text-zinc-300">
                We encourage students to showcase their talents in events like the State Special School Youth Festival and Work Experience Fairs, with activities like wood craft, paper craft, ornament making, and more.
              </p>
            </div>
          </section>

          {/* Life Skills & Counselling */}
          <section className="md:col-span-3 bg-zinc-900 dark:bg-zinc-800 text-white rounded-3xl border border-zinc-800 dark:border-zinc-700 overflow-hidden flex flex-col sm:flex-row-reverse">
            <div className="p-8 flex-1 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-white dark:text-hc-interactive mb-4 [text-wrap:balance]">Life Skills & Counselling</h2>
              <h3 className="text-2xl font-bold text-primary-300 dark:text-hc-interactive mb-3">Guidance & Counselling</h3>
              <p className="text-lg text-zinc-300">
                The Souhrida Club provides counselling for parents and students to cope with challenges. We also have a career guidance cell to make students aware of various job opportunities.
              </p>
            </div>
            <div className="w-full sm:w-2/5 bg-zinc-700 min-h-[250px] flex items-center justify-center text-zinc-400">
              Counselling Image
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
