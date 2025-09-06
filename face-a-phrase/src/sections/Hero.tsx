import NavBar from '@/components/NavBar';

export default function Hero(){
  return (
    <div className="grain">
      <NavBar />
      <main className="pt-24">
        <section className="container-page text-center space-y-6">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            One selfie + one sentence = your daily clip.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Talking-head, captions, watermark — free.
          </p>
          <div className="flex items-center justify-center gap-3">
            <a href="/create" className="px-5 py-3 rounded-full text-white bg-[var(--primary)] hover:opacity-90">Make a clip</a>
            <a href="/#how" className="px-5 py-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/15">See how it works</a>
          </div>
        </section>
      </main>
    </div>
  );
}


