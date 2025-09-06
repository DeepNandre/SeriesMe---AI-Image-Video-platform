import Section from '@/components/Section';
import Card from '@/components/Card';

export default function Steps(){
  const items = [
    { title: 'Upload a selfie', desc: 'Clear headshot, good lighting.' },
    { title: 'Type one sentence', desc: 'Max 200 characters.' },
    { title: 'Get your clip', desc: '10–15s vertical with captions & watermark.' },
  ];
  return (
    <Section id="how">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold">How it works</h2>
        <p className="text-muted-foreground">Three simple steps to your daily clip</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
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


