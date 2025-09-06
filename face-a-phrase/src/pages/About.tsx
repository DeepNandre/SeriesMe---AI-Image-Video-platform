import { Shield, Users, Zap, ArrowLeft, Star, Heart, Sparkles } from 'lucide-react';
import Navigation from '@/components/Navigation';

const About = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 pb-24 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-40 left-5 w-24 h-24 bg-accent/10 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-success/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative px-4 pt-8 max-w-md mx-auto">
          {/* Header - More Engaging */}
          <div className="flex items-center justify-between mb-12">
            <a href="/" className="p-3 hover:bg-white/50 rounded-xl transition-all duration-200 backdrop-blur-sm">
              <ArrowLeft className="h-5 w-5" />
            </a>
            <div className="text-center">
              <h1 className="text-2xl font-black text-foreground">About SeriesMe</h1>
              <p className="text-xs text-primary font-semibold">✨ The magic behind viral videos</p>
            </div>
            <div className="w-11" />
          </div>

          <div className="space-y-10">
            {/* Mission - More Exciting */}
            <div className="text-center space-y-6 bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-2xl">
              <div className="relative">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-2xl mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full animate-bounce">
                  <Heart className="h-3 w-3 text-white m-1.5" />
                </div>
              </div>
              <h2 className="text-3xl font-black text-foreground">Revolutionary Video Creation</h2>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                🚀 SeriesMe is the <span className="text-primary font-bold">future of content creation</span> - transforming your selfie and one powerful sentence into <span className="text-accent font-bold">professional talking-head videos</span> that are perfect for going viral on social media.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm font-bold">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">⚡ 5 minutes</span>
                <span className="bg-accent/10 text-accent px-3 py-1 rounded-full">🛡️ Safe</span>
                <span className="bg-success/10 text-success px-3 py-1 rounded-full">📱 Viral-ready</span>
              </div>
            </div>

            {/* Core Values - More Engaging */}
            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-success/20 to-primary/20 rounded-2xl blur-sm group-hover:blur-none transition-all duration-300"></div>
                <div className="relative flex items-start space-x-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-success to-success/70 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Shield className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-xl mb-3 text-foreground">🛡️ Safe & Consensual</h3>
                    <p className="text-muted-foreground font-medium leading-relaxed">
                      We require <span className="text-success font-bold">explicit consent</span> for all uploads. No public figures, 
                      no unauthorized use. Every video includes a <span className="text-success font-bold">visible watermark</span> for transparency.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-sm group-hover:blur-none transition-all duration-300"></div>
                <div className="relative flex items-start space-x-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Zap className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-xl mb-3 text-foreground">⚡ Lightning Fast</h3>
                    <p className="text-muted-foreground font-medium leading-relaxed">
                      From upload to download in <span className="text-primary font-bold">under 5 minutes</span>. One screen, 
                      one job. No complex editing or technical skills required. Just <span className="text-primary font-bold">pure magic</span>!
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-success/20 rounded-2xl blur-sm group-hover:blur-none transition-all duration-300"></div>
                <div className="relative flex items-start space-x-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-xl mb-3 text-foreground">👥 Built for Creators</h3>
                    <p className="text-muted-foreground font-medium leading-relaxed">
                      Designed for <span className="text-accent font-bold">creators, educators, and influencers</span> who want 
                      to share authentic video content that <span className="text-accent font-bold">goes viral</span> on social platforms.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Watermark Policy - More Engaging */}
            <div className="bg-gradient-to-r from-muted/50 to-primary/10 rounded-2xl p-8 border border-primary/20 shadow-xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-black text-xl text-foreground">🏷️ Watermark Policy</h3>
              </div>
              <p className="text-muted-foreground font-medium leading-relaxed">
                All generated videos include a <span className="text-primary font-bold">visible "SeriesMe" watermark</span> in the bottom-right corner. 
                This helps maintain <span className="text-primary font-bold">transparency about AI-generated content</span> and supports responsible use of this powerful technology.
              </p>
            </div>

            {/* Acceptable Use */}
            <div className="space-y-4">
              <h3 className="font-semibold">Acceptable Use</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-2">
                  <span className="text-success">✓</span>
                  <span>Personal content creation</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-success">✓</span>
                  <span>Educational videos with your own likeness</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-success">✓</span>
                  <span>Social media content (with proper consent)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-destructive">✗</span>
                  <span>Impersonating public figures or celebrities</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-destructive">✗</span>
                  <span>Using photos without explicit consent</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-destructive">✗</span>
                  <span>Creating misleading or harmful content</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-card border border-border rounded-lg p-6 text-center space-y-4">
              <h3 className="font-semibold">Questions or Concerns?</h3>
              <p className="text-sm text-muted-foreground">
                Have a question about content policies or need to report an issue?
              </p>
              <a 
                href="mailto:support@seriesme.app" 
                className="inline-block text-primary hover:text-primary/80 text-sm font-medium"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Navigation />
    </>
  );
};

export default About;