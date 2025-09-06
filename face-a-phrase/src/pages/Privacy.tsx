import { ArrowLeft, Shield, Eye, Trash2, Clock } from 'lucide-react';
import Navigation from '@/components/Navigation';

const Privacy = () => {
  return (
    <>
      <div className="min-h-screen bg-background pb-24">
        <div className="px-4 pt-8 max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <a href="/" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </a>
            <h1 className="text-xl font-semibold">Privacy</h1>
            <div className="w-9" />
          </div>

          <div className="space-y-8">
            {/* Intro */}
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Your privacy matters</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe in transparency about how your data is used. 
                Here's everything you need to know.
              </p>
            </div>

            {/* What we collect */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">What We Collect</h3>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>• Photos you upload for video generation</p>
                    <p>• Text scripts you provide</p>
                    <p>• Basic usage analytics (no personal info)</p>
                    <p>• Device type and browser for optimization</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4 w-4 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">How We Protect It</h3>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>• All uploads are encrypted in transit</p>
                    <p>• Photos are processed and deleted within 24 hours</p>
                    <p>• No data is sold to third parties</p>
                    <p>• Local storage for your video library only</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Data Retention</h3>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>• Source photos: Deleted after processing</p>
                    <p>• Generated videos: Stored locally on your device</p>
                    <p>• Analytics: Aggregated data only, 90 days max</p>
                    <p>• Cookies: Essential functionality only</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Trash2 className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Your Rights</h3>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>• Delete your local video library anytime</p>
                    <p>• Request data deletion (contact support)</p>
                    <p>• Opt out of analytics (browser settings)</p>
                    <p>• Clear app data in your browser</p>
                  </div>
                </div>
              </div>
            </div>

            {/* No Account Required */}
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold">No Account Required</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                SeriesMe doesn't require user accounts. Your generated videos are stored 
                locally in your browser, giving you complete control over your content.
              </p>
            </div>

            {/* Third Party Services */}
            <div className="space-y-4">
              <h3 className="font-semibold">Third Party Services</h3>
              <div className="text-sm text-muted-foreground space-y-3">
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="font-medium text-foreground mb-1">AI Processing</p>
                  <p>We use secure cloud services for video generation. Your photos are processed and immediately deleted.</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="font-medium text-foreground mb-1">Analytics</p>
                  <p>Privacy-focused analytics help us improve the app. No personal data or images are tracked.</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-card border border-border rounded-lg p-6 text-center space-y-4">
              <h3 className="font-semibold">Privacy Questions?</h3>
              <p className="text-sm text-muted-foreground">
                Have questions about how your data is handled?
              </p>
              <a 
                href="mailto:privacy@seriesme.app" 
                className="inline-block text-primary hover:text-primary/80 text-sm font-medium"
              >
                Contact Privacy Team
              </a>
            </div>

            {/* Last Updated */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Navigation />
    </>
  );
};

export default Privacy;