import { ReactNode } from 'react';

export default function Card({ children }: { children: ReactNode }){
  return (
    <div className="glass rounded-2xl p-6 shadow-soft hover:shadow-lg transition-transform duration-200 will-change-transform hover:-translate-y-0.5">
      {children}
    </div>
  );
}


