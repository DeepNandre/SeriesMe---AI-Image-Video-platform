import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { SeriesButton } from '@/components/SeriesButton';
import { ArrowDownIcon, SparklesIcon, BoltIcon, StarIcon } from '@heroicons/react/24/outline';
import { Particles } from '@/components/ui/particles';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const y = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -200]);

  const features = [
    { icon: SparklesIcon, text: "AI-Powered" },
    { icon: BoltIcon, text: "Lightning Fast" },
    { icon: StarIcon, text: "Viral Ready" },
  ];

  return (
    <motion.section
      className="relative flex flex-col items-center justify-center min-h-screen text-center pt-24 pb-16 overflow-hidden"
      style={{ y: prefersReducedMotion ? 0 : y }}
    >
      {/* Animated Background */}
      <Particles
        className="absolute inset-0"
        quantity={50}
        color="hsl(var(--primary))"
        size={0.5}
        particleLife={2}
        particleSpeed={0.5}
        variant="dot"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="relative z-10 container-page space-y-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
            ✨ Now with AI Magic
          </Badge>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          className="text-6xl sm:text-7xl md:text-8xl font-extrabold leading-[0.9] tracking-tighter"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            One selfie
          </span>
          <br />
          <span className="text-foreground">
            + one sentence
          </span>
          <br />
          <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
            = your daily clip
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Transform your selfie into a <span className="text-primary font-semibold">talking-head video</span> with 
          <span className="text-accent font-semibold"> AI captions</span> and 
          <span className="text-primary font-semibold"> viral-ready</span> effects completely free.
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {features.map((feature, index) => (
            <Card key={index} className="glass border-border/50">
              <CardContent className="flex items-center gap-2 px-4 py-2">
                <feature.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{feature.text}</span>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SeriesButton asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Link to="/create">
              <SparklesIcon className="mr-2 h-5 w-5" />
              Make a clip
            </Link>
          </SeriesButton>
          <SeriesButton asChild variant="outline" size="lg" className="border-border/50 hover:bg-muted/50">
            <a href="#how">
              See how it works <ArrowDownIcon className="ml-2 h-4 w-4" />
            </a>
          </SeriesButton>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-8 max-w-md mx-auto pt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">30s</div>
            <div className="text-sm text-muted-foreground">Generation</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">9:16</div>
            <div className="text-sm text-muted-foreground">Format</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">Free</div>
            <div className="text-sm text-muted-foreground">Forever</div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;


