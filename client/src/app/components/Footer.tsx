'use client';

export default function Footer() {
  return (
    <footer className="border-t border-black bg-white py-4 flex-shrink-0 w-full">
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base text-gray-600 px-4">
        {[
          'Help',
          'Status',
          'About',
          'Careers',
          'Press',
          'Blog',
          'Privacy',
          'Rules',
          'Terms',
          'Text to speech',
        ].map((item) => (
          <a key={item} href="#" className="hover:text-black transition">
            {item}
          </a>
        ))}
      </div>
    </footer>
  );
}
