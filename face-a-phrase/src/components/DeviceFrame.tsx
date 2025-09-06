import { ReactNode } from 'react';

export default function DeviceFrame({ children }: { children: ReactNode }){
  return (
    <div className="relative w-[260px] sm:w-[300px] mx-auto">
      <div className="absolute -inset-2 rounded-[24px] bg-gradient-to-b from-white/15 to-white/5 blur"></div>
      <div className="relative rounded-[24px] border border-white/15 bg-black overflow-hidden shadow-2xl">
        {children}
      </div>
    </div>
  );
}


