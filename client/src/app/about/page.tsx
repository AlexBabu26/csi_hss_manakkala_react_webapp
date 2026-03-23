import type { Metadata } from 'next';
import Image from 'next/image';
import { buildApiUrl } from '@/lib/api';

export const metadata: Metadata = {
  title: 'About Us | CSI HSS For The Partially Hearing',
  description: 'Learn about our mission, leadership, and state-of-the-art facilities dedicated to empowering students with partial hearing.',
};

interface Leader {
  id: number;
  full_name: string;
  position_title: string;
  photo_url: string;
}

interface Facility {
  id: number;
  name: string;
  image_url: string;
  alt_text?: string;
}

async function getLeadership(): Promise<Leader[]> {
  try {
    const res = await fetch(buildApiUrl('/api/media/leadership'), { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

async function getFacilities(): Promise<Facility[]> {
  try {
    const res = await fetch(buildApiUrl('/api/media/facilities'), { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

const DEFAULT_MISSION =
  'To bring the marginalised community of the Hearing Impaired to the main stream of the society by equipping them with quality education and bringing out the talent inherent in them. We strive to develop individuality, creativity, authenticity and self respect, and to help students gain self confidence to face challenges and emerge successful.';

const DEFAULT_PHILOSOPHY =
  'Inheriting a legacy from the CMS missionaries, we strive for the upliftment of the common people by providing them with better education. C.S.I. Madhya Kerala Diocese has special concern for the less privileged and the differently abled, taking the initiative in the education and rehabilitation of hearing impaired children in Kerala.';

async function getAboutContent(): Promise<{ mission: string; philosophy: string }> {
  try {
    const res = await fetch(buildApiUrl('/api/content/about'), { next: { revalidate: 3600 } });
    if (!res.ok) return { mission: DEFAULT_MISSION, philosophy: DEFAULT_PHILOSOPHY };
    const data = await res.json();
    return {
      mission: data?.mission || DEFAULT_MISSION,
      philosophy: data?.philosophy || DEFAULT_PHILOSOPHY,
    };
  } catch {
    return { mission: DEFAULT_MISSION, philosophy: DEFAULT_PHILOSOPHY };
  }
}

export default async function About() {
  const [leaders, facilities, aboutContent] = await Promise.all([
    getLeadership(),
    getFacilities(),
    getAboutContent(),
  ]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in motion-reduce:animate-none">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-zinc-900 dark:text-hc-text mb-6 tracking-tight [text-wrap:balance]">
            About Our School
          </h1>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)] mb-12">
          
          {/* Mission Card - Spans 2 columns */}
          <section className="md:col-span-2 bg-primary-50 dark:bg-zinc-800 p-8 rounded-3xl border border-primary-100 dark:border-zinc-700 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-primary-800 dark:text-hc-interactive mb-4 [text-wrap:balance]">Our Mission</h2>
            <p className="text-lg text-zinc-800 dark:text-zinc-300 leading-relaxed">
              {aboutContent.mission}
            </p>
          </section>

          {/* Philosophy Card - 1 column */}
          <section className="bg-zinc-50 dark:bg-zinc-800 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-700 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-primary-700 dark:text-hc-interactive mb-4 [text-wrap:balance]">Our Philosophy</h2>
            <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {aboutContent.philosophy}
            </p>
          </section>
        </div>

        {/* Leadership Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center text-zinc-900 dark:text-hc-text mb-10 [text-wrap:balance]">Meet Our Leadership</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaders.map((leader) => (
              <div key={leader.id} className="bg-white dark:bg-zinc-800 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-700 text-center flex flex-col items-center shadow-sm">
                <div className="w-32 h-32 rounded-full mb-4 overflow-hidden relative bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                  {leader.photo_url ? (
                    <Image
                      src={leader.photo_url}
                      alt={`Photo of ${leader.full_name}`}
                      fill
                      className="object-cover"
                      sizes="128px"
                      unoptimized
                    />
                  ) : (
                    <span className="text-xs text-zinc-400">Photo</span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-1 text-zinc-900 dark:text-white">{leader.full_name}</h3>
                <p className="text-primary-600 dark:text-hc-interactive font-medium">{leader.position_title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Facilities Bento Grid */}
        <section>
          <h2 className="text-4xl font-bold text-center text-zinc-900 dark:text-hc-text mb-10 [text-wrap:balance]">Our Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(200px,auto)]">
            {facilities.map((facility) => (
              <div key={facility.id} className="bg-white dark:bg-zinc-800 rounded-3xl border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-sm flex flex-col">
                <div className="h-48 relative bg-zinc-200 dark:bg-zinc-700 w-full flex items-center justify-center">
                  {facility.image_url ? (
                    <Image
                      src={facility.image_url}
                      alt={facility.alt_text || facility.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 25vw"
                      unoptimized
                    />
                  ) : (
                    <span className="text-zinc-500 text-sm">Image</span>
                  )}
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{facility.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
