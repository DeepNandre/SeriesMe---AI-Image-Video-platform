export default function Footer(){
  return (
    <footer className="mt-24 py-10 border-t border-white/10 text-sm">
      <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-muted-foreground">© {new Date().getFullYear()} SeriesMe</p>
        <nav className="flex items-center gap-6">
          <a className="hover:opacity-80" href="/about">About</a>
          <a className="hover:opacity-80" href="/privacy">Privacy</a>
        </nav>
      </div>
    </footer>
  );
}


