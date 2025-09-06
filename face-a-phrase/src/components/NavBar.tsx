import { useEffect, useState } from 'react';

export default function NavBar(){
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? 'backdrop-blur-md bg-white/70 dark:bg-black/30 shadow-sm' : 'backdrop-blur-sm bg-white/40 dark:bg-black/20'}`}>
      <nav className="container-page flex items-center justify-between h-14">
        <a className="font-bold" href="/">SeriesMe</a>
        <div className="hidden sm:flex items-center gap-6 text-sm">
          <a href="/create" className="hover:opacity-80">Create</a>
          <a href="/library" className="hover:opacity-80">Library</a>
          <a href="/about" className="hover:opacity-80">About</a>
          <a href="/privacy" className="hover:opacity-80">Privacy</a>
          <a href="/create" className="px-3 py-1.5 rounded-full text-white bg-[var(--primary)] hover:opacity-90">Make a clip</a>
        </div>
      </nav>
    </header>
  );
}


