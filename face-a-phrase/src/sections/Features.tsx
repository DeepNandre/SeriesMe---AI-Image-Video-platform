import Section from '@/components/Section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Sparkles, CloudOff, BookOpen, ShieldCheck, Download, Zap, Star, Captions, Eye, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/motion';

const features = [
  { 
    icon: Captions, 
    title: 'Auto-Captions', 
    description: 'Always-on subtitles for maximum reach and accessibility.',
    color: 'from-blue-500 to-cyan-500',
    highlight: 'Smart'
  },
  { 
    icon: Eye, 
    title: 'Visible Watermark', 
    description: 'Transparent "SeriesMe" mark for responsible AI content.',
    color: 'from-green-500 to-emerald-500',
    highlight: 'Ethical'
  },
  { 
    icon: ShieldCheck, 
    title: 'Consent-First', 
    description: 'Explicit consent required for all uploads and processing.',
    color: 'from-purple-500 to-pink-500',
    highlight: 'Safe'
  },
  { 
    icon: Zap, 
    title: 'Lightning Fast', 
    description: 'No paid infrastructure required - runs entirely free.',
    color: 'from-orange-500 to-red-500',
    highlight: 'Fast'
  },
  { 
    icon: CloudOff, 
    title: 'Offline Library', 
    description: 'Your creations saved locally in browser storage.',
    color: 'from-indigo-500 to-purple-500',
    highlight: 'Private'
  },
  { 
    icon: CheckCircle, 
    title: 'Mobile-First', 
    description: 'Optimized 9:16 preview and touch-friendly controls.',
    color: 'from-cyan-500 to-blue-500',
    highlight: 'Mobile'
  },
];

const Features = () => {
  return (
    <Section className="text-center">
      <motion.div
        className="space-y-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-4">
          <Badge variant="outline" className="px-4 py-2">
            <Star className="w-3 h-3 mr-2" />
            Everything you need
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Built for creators
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create viral content, powered by AI and designed for privacy
          </p>
        </div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20">
                <CardHeader className="text-center space-y-4">
                  <div className="relative">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${feature.color} p-0.5 group-hover:scale-110 transition-transform duration-300`}>
                      <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
                        <feature.icon className="h-7 w-7 text-primary" />
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 -right-2 text-xs font-medium"
                    >
                      {feature.highlight}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-border/50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">30s</div>
            <div className="text-sm text-muted-foreground">Generation Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">9:16</div>
            <div className="text-sm text-muted-foreground">Perfect Format</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">100%</div>
            <div className="text-sm text-muted-foreground">Privacy First</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">Free</div>
            <div className="text-sm text-muted-foreground">Forever</div>
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
};

export default Features;


