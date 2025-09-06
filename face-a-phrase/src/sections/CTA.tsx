import Section from '@/components/Section';
import { SeriesButton } from '@/components/SeriesButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { FLAGS } from '@/lib/flags';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/motion';
import { SparklesIcon, ArrowRightIcon, BoltIcon } from '@heroicons/react/24/outline';

const CTA = () => {
  return (
    <Section className="text-center py-24">
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-3xl" />
        
        <Card className="relative glass border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-12 space-y-8">
            <motion.div
              className="space-y-4"
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                <SparklesIcon className="w-3 h-3 mr-2" />
                Ready to create?
              </Badge>
              
              <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Start your daily clip
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of creators making viral content with AI. 
                <span className="text-primary font-semibold"> Free forever</span>, 
                <span className="text-accent font-semibold"> privacy-first</span>, 
                <span className="text-primary font-semibold"> lightning-fast</span>.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.2 }}
            >
              {/* Main CTA - show sign-in modal when auth enabled, direct access when disabled */}
              {FLAGS.AUTH_ENABLED ? (
                <>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <SeriesButton 
                        size="xl" 
                        className="bg-gradient-to-r from-primary to-accent text-white font-black text-xl py-6 px-8 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 group"
                      >
                        <SparklesIcon className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
                        Open Generator
                        <ArrowRightIcon className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                      </SeriesButton>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <SeriesButton 
                      asChild 
                      size="xl" 
                      className="bg-gradient-to-r from-primary to-accent text-white font-black text-xl py-6 px-8 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 group"
                    >
                      <Link to="/create">
                        <SparklesIcon className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
                        Open Generator
                        <ArrowRightIcon className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </SeriesButton>
                  </SignedIn>
                </>
              ) : (
                <SeriesButton 
                  asChild 
                  size="xl" 
                  className="bg-gradient-to-r from-primary to-accent text-white font-black text-xl py-6 px-8 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 group"
                >
                  <Link to="/create">
                    <SparklesIcon className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
                    Open Generator
                    <ArrowRightIcon className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </SeriesButton>
              )}
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BoltIcon className="h-4 w-4 text-accent" />
                <span>30 seconds to viral</span>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50"
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-xs text-muted-foreground">Videos Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">99.9%</div>
                <div className="text-xs text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">Free</div>
                <div className="text-xs text-muted-foreground">Forever</div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </Section>
  );
};

export default CTA;


