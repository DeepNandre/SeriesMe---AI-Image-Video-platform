import Section from '@/components/Section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CloudArrowUpIcon, PencilSquareIcon, VideoCameraIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/motion';

const steps = [
  { 
    icon: CloudArrowUpIcon, 
    title: 'Upload a selfie', 
    description: 'A clear headshot with good lighting works best for AI processing.',
    number: '01',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    icon: PencilSquareIcon, 
    title: 'Type one sentence', 
    description: 'Your viral message, max 200 characters. AI will sync it perfectly.',
    number: '02',
    color: 'from-cyan-500 to-emerald-500'
  },
  { 
    icon: VideoCameraIcon, 
    title: 'Get your clip', 
    description: 'A 9:16 vertical video with talking head, captions, and watermark.',
    number: '03',
    color: 'from-emerald-500 to-blue-500'
  },
];

const Steps = () => {
  return (
    <Section id="how" className="text-center">
      <motion.div
        className="space-y-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-4">
          <Badge variant="outline" className="px-4 py-2">
            Simple Process
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to create your viral video content
          </p>
        </div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 relative"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={fadeInUp} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-border to-transparent z-0" />
              )}
              
              <Card className="relative z-10 hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="text-center space-y-4">
                  <div className="relative">
                    <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${step.color} p-0.5`}>
                      <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
                        <step.icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0 flex items-center justify-center text-xs font-bold"
                    >
                      {step.number}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="text-center">
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  
                  {index < steps.length - 1 && (
                    <div className="mt-6 flex justify-center">
                      <ArrowRightIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="pt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-sm text-muted-foreground">
            Ready to create? It takes less than 30 seconds.
          </p>
        </motion.div>
      </motion.div>
    </Section>
  );
};

export default Steps;


