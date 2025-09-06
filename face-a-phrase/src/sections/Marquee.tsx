export default function Marquee(){
  const logos = ['🎥','🎬','📱','✨','🎞️','🛡️'];
  return (
    <section aria-label="Made with" className="mt-10">
      <div className="overflow-hidden py-4 border-y border-white/10">
        <div className="flex gap-10 animate-[scroll_20s_linear_infinite] whitespace-nowrap px-6">
          {logos.concat(logos).map((l,i)=> (
            <span key={i} className="opacity-70 text-lg">{l}</span>
          ))}
        </div>
      </div>
      <style>{`@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </section>
  );
}


