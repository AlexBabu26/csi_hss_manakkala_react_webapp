import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery | CSI HSS For The Partially Hearing',
  description: 'View photos from our campus, events, and student activities.',
};

export default function Gallery() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-hc-text mb-8">Photo Gallery</h1>
        
        <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-12">
          A glimpse into the vibrant life, activities, and facilities at our school.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mocked Gallery Images */}
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="aspect-square bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden relative group">
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                        Image {item}
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p className="text-white font-medium">Campus Activity {item}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
