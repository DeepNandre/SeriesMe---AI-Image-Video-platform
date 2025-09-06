import { useEffect, useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { FLAGS } from '@/lib/flags';
import ThemeToggle from './ThemeToggle';

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
          {/* Cloud Library - only visible when signed in and auth enabled */}
          {FLAGS.AUTH_ENABLED && (
            <SignedIn>
              <a href="/cloud" className="hover:opacity-80 text-blue-600 dark:text-blue-400">Cloud Library (beta)</a>
            </SignedIn>
          )}
          <a href="/about" className="hover:opacity-80">About</a>
          <a href="/privacy" className="hover:opacity-80">Privacy</a>
          
          {/* Auth UI - only when AUTH_ENABLED=true */}
          {FLAGS.AUTH_ENABLED ? (
            <>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="hover:opacity-80">Sign in</button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </>
          ) : (
            // Default CTA when auth is disabled
            <a href="/create" className="px-3 py-1.5 rounded-full text-white bg-[var(--primary)] hover:opacity-90">Make a clip</a>
          )}
          
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}


