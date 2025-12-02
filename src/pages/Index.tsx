import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Video, Upload, LogOut, Play } from "lucide-react";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
              <Video className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">VideoHub</span>
          </div>
          
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-2xl mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Video className="h-16 w-16 text-primary-foreground" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
            Share Your Story
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            Upload, manage, and share your videos with the world. Professional video hosting made simple.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            {user ? (
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary-glow text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate('/upload')}
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Video
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary-glow text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                  onClick={() => navigate('/auth')}
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Video Player Section */}
        <div className="max-w-4xl mx-auto mt-24 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Play className="h-4 w-4" />
              <span className="text-sm font-medium">Featured Video</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Watch Our Demo
            </h2>
            <p className="text-muted-foreground">
              See how easy it is to share your videos
            </p>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border bg-card">
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-24">
          <div className="p-6 rounded-xl bg-card border border-border text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Easy Upload</h3>
            <p className="text-muted-foreground">
              Drag and drop your videos or click to browse. Up to 50MB per file.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Secure Storage</h3>
            <p className="text-muted-foreground">
              Your videos are stored securely with enterprise-grade infrastructure.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Full Control</h3>
            <p className="text-muted-foreground">
              Manage privacy settings, descriptions, tags, and categories with ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;