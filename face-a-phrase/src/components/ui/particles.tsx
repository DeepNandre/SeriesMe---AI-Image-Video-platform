"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

export interface ParticlesProps {
  className?: string;
  quantity?: number;
  ease?: number;
  color?: string;
  size?: number;
  particleLife?: number;
  particleSpeed?: number;
  particleSpeedVariation?: number;
  particleRadius?: number;
  variant?: "dot" | "line";
  lineWidth?: number;
  cull?: boolean;
  all?: boolean;
  min?: number;
  max?: number;
  refresh?: boolean;
}

export const Particles: React.FC<ParticlesProps> = ({
  className,
  quantity = 30,
  ease = 50,
  color = "#ffffff",
  size = 0.4,
  particleLife = 1.5,
  particleSpeed = 0.75,
  particleSpeedVariation = 0.5,
  particleRadius = 0.5,
  variant = "dot",
  lineWidth = 0.5,
  cull = true,
  all = false,
  min = 0.1,
  max = 0.9,
  refresh = false,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const animationRef = React.useRef<number>();
  const particlesRef = React.useRef<any[]>([]);

  React.useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: any[] = [];

    const resizeCanvas = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };

    const createParticle = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const vx = (Math.random() - 0.5) * particleSpeed * 2;
      const vy = (Math.random() - 0.5) * particleSpeed * 2;
      const life = particleLife;
      const maxLife = particleLife;

      return { x, y, vx, vy, life, maxLife };
    };

    const updateParticle = (particle: any) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 0.016;

      if (particle.life <= 0) {
        const newParticle = createParticle();
        Object.assign(particle, newParticle);
      }
    };

    const drawParticle = (particle: any) => {
      const alpha = particle.life / particle.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;

      if (variant === "dot") {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
      } else if (variant === "line") {
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x - particle.vx * 10, particle.y - particle.vy * 10);
        ctx.stroke();
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        updateParticle(particle);
        drawParticle(particle);
      });

      animationId = requestAnimationFrame(animate);
    };

    const init = () => {
      resizeCanvas();
      particles.length = 0;
      for (let i = 0; i < quantity; i++) {
        particles.push(createParticle());
      }
      animate();
    };

    init();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [
    quantity,
    ease,
    color,
    size,
    particleLife,
    particleSpeed,
    particleSpeedVariation,
    particleRadius,
    variant,
    lineWidth,
    cull,
    all,
    min,
    max,
    refresh,
  ]);

  return (
    <div ref={containerRef} className={cn("absolute inset-0", className)}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
