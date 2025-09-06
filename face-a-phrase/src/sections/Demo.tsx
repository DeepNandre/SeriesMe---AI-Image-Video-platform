import Section from '@/components/Section';
import DeviceFrame from '@/components/DeviceFrame';

export default function Demo(){
  return (
    <Section>
      <div className="grid sm:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">See it in action</h2>
          <p className="text-muted-foreground mb-4">Vertical 9:16 preview with captions and watermark.</p>
          <a href="/create" className="inline-block px-5 py-3 rounded-full text-white bg-[var(--primary)] hover:opacity-90">Generate yours in 30 seconds</a>
        </div>
        <div className="justify-self-center">
          <DeviceFrame>
            <video
              className="w-[260px] sm:w-[300px] aspect-[9/16] object-cover"
              preload="metadata"
              muted
              playsInline
              controls
              poster="/placeholder.svg"
              src="https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4"
            />
          </DeviceFrame>
        </div>
      </div>
    </Section>
  );
}


