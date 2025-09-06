import Section from '@/components/Section';
import Card from '@/components/Card';

export default function Features(){
  const items = [
    { title: 'Captions included', desc: 'Always-on subtitles for reach and clarity.' },
    { title: 'Watermark', desc: 'Visible “SeriesMe” mark for responsible AI.' },
    { title: 'Consent-first', desc: 'Explicit consent required for uploads.' },
    { title: 'Free pipeline', desc: 'No paid infra required in mock mode.' },
    { title: 'Offline library', desc: 'Saved results in your browser storage.' },
    { title: 'Mobile-first', desc: 'Optimized 9:16 preview and controls.' },
  ];
  return (
    <Section>
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold">Everything you need</h2>
        <p className="text-muted-foreground">Glass cards, low ink UI</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {items.map((it) => (
          <Card key={it.title}>
            <h3 className="font-semibold mb-1">{it.title}</h3>
            <p className="text-sm text-muted-foreground">{it.desc}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}


