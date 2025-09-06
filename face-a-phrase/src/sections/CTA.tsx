export default function CTA(){
  return (
    <section className="mt-20">
      <div className="container-page text-center rounded-3xl p-10 sm:p-16 bg-gradient-to-r from-[rgba(122,162,255,0.15)] to-[rgba(0,194,168,0.15)] border border-white/10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Start your daily clip</h2>
        <a href="/create" className="inline-block px-6 py-3 rounded-full text-white bg-[var(--primary)] hover:opacity-90">Open Generator</a>
      </div>
    </section>
  );
}


