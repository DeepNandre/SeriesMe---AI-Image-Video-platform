import { ReactNode } from 'react';

export default function Section({ id, children, className }: { id?: string; children: ReactNode; className?: string }){
  return (
    <section id={id} className={`container-page py-16 sm:py-24 ${className || ''}`}>
      {children}
    </section>
  );
}


