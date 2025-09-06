import { Video, Sparkles, Zap, Star, Play, ArrowRight } from 'lucide-react';
import { SeriesButton } from '@/components/SeriesButton';
import Navigation from '@/components/Navigation';

const Index = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-40 left-5 w-24 h-24 bg-accent/10 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-success/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Hero Section */}
        <div className="relative px-4 pt-16 pb-24 max-w-md mx-auto">
          {/* Logo/Brand - More Dynamic */}
          <div className="text-center mb-16">
            <div className="relative w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300">
              <Video className="h-12 w-12 text-white" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full animate-bounce">
                <Star className="h-3 w-3 text-white m-1.5" />
              </div>
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight">SeriesMe</h1>
            <div className="inline-flex items-center px-3 py-1 bg-primary/10 rounded-full mt-2">
              <span className="text-sm font-semibold text-primary">Lite</span>
              <span className="ml-2 text-xs text-accent">✨ FREE</span>
            </div>
          </div>

          {/* Value Proposition - More Exciting */}
          <div className="text-center mb-16 space-y-6">
            <h2 className="text-5xl font-black leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                INSTANT
              </span>
              <br />
              <span className="text-foreground">VIRAL VIDEOS</span>
            </h2>
            <div className="relative">
              <p className="text-xl font-medium text-foreground/80 leading-relaxed">
                🤳 Selfie + 💬 Sentence = 🎬 Viral Clip
              </p>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>
            <p className="text-lg text-muted-foreground font-medium">
              TikTok-ready • Captions included • Watermarked for safety
            </p>
          </div>

          {/* Features - More Visual Impact */}
          <div className="space-y-4 mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-2xl blur-sm group-hover:blur-none transition-all duration-300"></div>
              <div className="relative flex items-center space-x-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/70 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg">⚡ 5-minute magic</p>
                  <p className="text-sm text-muted-foreground font-medium">Upload → Generate → Download → Viral!</p>
                </div>
                <ArrowRight className="h-5 w-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-success/20 rounded-2xl blur-sm group-hover:blur-none transition-all duration-300"></div>
              <div className="relative flex items-center space-x-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg">📱 Perfect for social</p>
                  <p className="text-sm text-muted-foreground font-medium">9:16 vertical • Reels • TikTok • Shorts</p>
                </div>
                <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-success/20 to-primary/20 rounded-2xl blur-sm group-hover:blur-none transition-all duration-300"></div>
              <div className="relative flex items-center space-x-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-success to-success/70 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg">🛡️ Safe & ethical</p>
                  <p className="text-sm text-muted-foreground font-medium">Consent required • Watermarked • Responsible AI</p>
                </div>
                <ArrowRight className="h-5 w-5 text-success opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>

          {/* CTA - More Exciting */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-md group-hover:blur-lg transition-all duration-300 opacity-75"></div>
              <SeriesButton 
                variant="hero" 
                size="xl"
                className="relative w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-black text-xl py-6 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                onClick={() => window.location.href = '/create'}
              >
                🚀 CREATE MY FIRST VIRAL VIDEO
              </SeriesButton>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-muted-foreground/70 mb-4">
                Join thousands creating viral content daily
              </p>
              <div className="flex justify-center space-x-8 text-xs">
                <a href="/about" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  About
                </a>
                <a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Privacy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Navigation />
    </>
  );
};

export default Index;
