import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FileText, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, signInWithGoogle, isAuthenticated, loading } = useAuth();

  // Redirect to dashboard when authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, loading, navigate]);

  // Handle OAuth callback from URL hash
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.has('access_token')) {
      // Supabase will process this via onAuthStateChange
      // Wait for session to be established
      let attempts = 0;
      const maxAttempts = 20; // 6 seconds max wait
      
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate("/dashboard");
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkSession, 300);
        } else {
          console.warn('⚠️ OAuth session not established after waiting');
          toast({
            title: "Sign-in timeout",
            description: "Please try signing in again.",
            variant: "destructive",
          });
        }
      };
      setTimeout(checkSession, 500);
    }
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Please sign in instead.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign up failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Account created!",
            description: "You can now access your dashboard.",
          });
          // Wait for session to be established
          let attempts = 0;
          const maxAttempts = 20; // 6 seconds max wait
          
          const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              navigate("/dashboard");
            } else if (attempts < maxAttempts) {
              attempts++;
              setTimeout(checkSession, 300);
            } else {
              console.warn('⚠️ Session not established after sign-up');
              toast({
                title: "Please sign in",
                description: "Account created. Please sign in to continue.",
                variant: "default",
              });
            }
          };
          setTimeout(checkSession, 300);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You've successfully signed in.",
          });
          // Wait for session to be established
          let attempts = 0;
          const maxAttempts = 20; // 6 seconds max wait
          
          const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              navigate("/dashboard");
            } else if (attempts < maxAttempts) {
              attempts++;
              setTimeout(checkSession, 300);
            } else {
              console.warn('⚠️ Session not established after sign-in');
              toast({
                title: "Sign-in issue",
                description: "Please try signing in again.",
                variant: "destructive",
              });
            }
          };
          setTimeout(checkSession, 300);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">ResuOne</h1>
          <p className="text-white/80 text-lg">
            Build professional resumes in minutes. Save your progress and access your resumes from anywhere.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 text-white/70 text-sm">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="font-semibold text-white">5 Templates</div>
              <div>Professional designs</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="font-semibold text-white">ATS-Friendly</div>
              <div>Pass tracking systems</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="font-semibold text-white">PDF & DOCX</div>
              <div>Multiple formats</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="font-semibold text-white">Save Online</div>
              <div>Access anywhere</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">ResuOne</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isSignUp 
              ? "Sign up to save your resumes and access them anywhere" 
              : "Sign in to access your saved resumes"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoComplete="name"
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete={isSignUp ? "email" : "email"}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  required
                  minLength={6}
                  className="pl-10"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              variant="hero"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? "Please wait..." 
                : isSignUp 
                  ? "Create Account" 
                  : "Sign In"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full mt-4"
              onClick={async () => {
                try {
                  console.log('Attempting Google sign-in...');
                  const { data, error } = await signInWithGoogle();
                  console.log('Google sign-in response:', { data, error });
                  
                  if (error) {
                    console.error('Google sign-in error:', error);
                    toast({
                      title: "Google sign-in failed",
                      description: error.message || "Google OAuth is not properly configured. Please check Supabase settings.",
                      variant: "destructive",
                    });
                  } else if (data?.url) {
                    // OAuth redirect will happen automatically
                    console.log('Redirecting to:', data.url);
                  }
                } catch (err: any) {
                  console.error('Google sign-in exception:', err);
                  toast({
                    title: "Google sign-in error",
                    description: err.message || "Please check browser console for details. Ensure Google provider is enabled in Supabase.",
                    variant: "destructive",
                  });
                }
              }}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline"
            >
              {isSignUp 
                ? "Already have an account? Sign in" 
                : "Don't have an account? Sign up"}
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            By continuing, you agree to ResuOne's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
