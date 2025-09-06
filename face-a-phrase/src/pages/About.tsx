import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="grain min-h-screen">
      <NavBar />
      <div className="container-page pt-24 pb-24">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold">About SeriesMe</h1>
          <p className="text-muted-foreground">The magic behind simple, safe short‑form creation</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-2">🛡️ Safe & consensual</h3>
            <p className="text-sm text-muted-foreground">Explicit consent required, no public figures, visible watermark for transparency.</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-2">⚡ Lightning‑fast</h3>
            <p className="text-sm text-muted-foreground">From upload to download in minutes in mock mode; ready for backend integration.</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-2">👥 Built for creators</h3>
            <p className="text-sm text-muted-foreground">Designed for educators and influencers who need vertical, captioned clips fast.</p>
          </div>
        </div>

        <div className="rounded-2xl p-6 mt-8 border border-white/10 bg-white/5">
          <h3 className="font-semibold mb-2">Watermark policy</h3>
          <p className="text-sm text-muted-foreground">All generated videos include a small “SeriesMe” watermark to keep AI content clear and responsible.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;