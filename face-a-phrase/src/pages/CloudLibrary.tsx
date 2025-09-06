import { useUser } from '@clerk/clerk-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

/**
 * CloudLibrary - Example protected route that requires authentication
 * 
 * This demonstrates how future cloud features would work:
 * - Only accessible when AUTH_ENABLED=true and user is signed in
 * - Shows user-specific content
 * - Would integrate with backend storage in real implementation
 */
const CloudLibrary = () => {
  const { user } = useUser();

  return (
    <div className="grain min-h-screen">
      <NavBar />
      <div className="container-page pt-24 pb-24">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold">Cloud Library</h1>
          <p className="text-xs text-muted-foreground mt-2">
            ☁️ Your videos, synchronized across devices
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="glass rounded-2xl p-8 text-center">
            <div className="text-6xl mb-6">☁️</div>
            
            <h2 className="text-xl font-bold mb-4">
              Welcome to Cloud Library, {user?.firstName || 'Creator'}!
            </h2>
            
            <p className="text-muted-foreground mb-6">
              This is a protected route that demonstrates how cloud features work 
              when authentication is enabled. Your videos would be stored securely 
              in the cloud and accessible from any device.
            </p>

            <div className="space-y-4 text-left">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  🔒 Privacy & Security
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your videos are encrypted and only accessible to you. 
                  User ID: <code className="font-mono bg-blue-100 dark:bg-blue-900 px-1 rounded">
                    {user?.id}
                  </code>
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">
                  ✨ Coming Soon
                </h3>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Cross-device synchronization</li>
                  <li>• Advanced video analytics</li>
                  <li>• Team collaboration features</li>
                  <li>• Cloud-based video processing</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                  🚀 Current Status
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  This page is a placeholder. In production, you would see your 
                  cloud-synced video library here, powered by your authenticated session.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <a 
                href="/create" 
                className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Create Your First Cloud Video
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default CloudLibrary;