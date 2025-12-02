import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Zap, Download, Layout, Shield, Sparkles, Linkedin, Github, Mail, CheckCircle, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">ResuOne</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#templates" className="text-muted-foreground hover:text-foreground transition-colors">Templates</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          </nav>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="outline">
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="outline">Sign In</Button>
              </Link>
            )}
            <Link to="/edit">
              <Button variant="default">Create Resume</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-6 animate-fade-in">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                ATS-Friendly
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                <Layout className="w-4 h-4" />
                Professional Templates
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                100% Free
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Build Your Perfect
              <span className="text-gradient block mt-2">Resume in Minutes</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Create professional, ATS-friendly resumes with our intuitive builder. 
              Choose from 5 stunning templates, customize every detail, and export to PDF or DOCX instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link to="/edit">
                <Button size="xl" variant="hero" className="w-full sm:w-auto">
                  <FileText className="w-5 h-5" />
                  Start Building — It's Free
                </Button>
              </Link>
              <a href="#templates">
                <Button size="xl" variant="outline" className="w-full sm:w-auto">
                  View Templates
                </Button>
              </a>
            </div>
            
            <p className="text-sm text-muted-foreground mt-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              Export unlimited resumes • No sign-up required to start
            </p>
          </div>
          
          {/* Preview mockup */}
          <div className="mt-16 max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="relative">
              <div className="absolute -inset-4 gradient-hero opacity-20 blur-2xl rounded-2xl" />
              <div className="relative bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="p-6 flex gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                    <div className="h-8 bg-primary/10 rounded mt-6" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-4/5" />
                  </div>
                  <div className="w-64 bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-2 bg-muted rounded w-full" />
                    <div className="h-2 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2 mt-4" />
                    <div className="h-2 bg-muted rounded w-full" />
                    <div className="h-2 bg-muted rounded w-5/6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make resume building effortless and effective.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Layout,
                title: "5 Professional Templates",
                description: "Choose from Minimal, Professional, Modern, ATS-Friendly, and Two-Column layouts designed by experts."
              },
              {
                icon: Zap,
                title: "Real-Time Preview",
                description: "See your changes instantly as you type. What you see is exactly what you'll export."
              },
              {
                icon: Download,
                title: "Export to PDF & DOCX",
                description: "Download your resume in multiple formats. All links remain clickable in exports."
              },
              {
                icon: Shield,
                title: "ATS-Optimized",
                description: "Our templates use semantic HTML and clean formatting to pass applicant tracking systems."
              },
              {
                icon: FileText,
                title: "Drag & Drop Sections",
                description: "Reorder your resume sections with simple drag and drop. Customize the flow that works for you."
              },
              {
                icon: Sparkles,
                title: "Auto-Save Draft",
                description: "Never lose your work. Your resume is automatically saved to your browser as you type."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl p-6 border border-border card-elevated animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Professional Templates for Every Style
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All templates are ATS-friendly and tested with major applicant tracking systems.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { 
                name: "Minimal", 
                description: "Clean, simple, and elegant",
                preview: (
                  <div className="w-full h-full bg-white p-3 space-y-2">
                    <div className="text-center mb-3">
                      <div className="h-4 bg-gray-800 rounded w-1/2 mx-auto mb-1" />
                      <div className="h-2 bg-gray-300 rounded w-3/4 mx-auto" />
                    </div>
                    <div className="h-2 bg-gray-400 rounded w-1/4 mb-1" />
                    <div className="h-1.5 bg-gray-200 rounded w-full" />
                    <div className="h-1.5 bg-gray-200 rounded w-5/6" />
                    <div className="h-2 bg-gray-400 rounded w-1/4 mt-2 mb-1" />
                    <div className="h-1.5 bg-gray-200 rounded w-full" />
                    <div className="h-1.5 bg-gray-200 rounded w-4/5" />
                  </div>
                )
              },
              { 
                name: "Professional", 
                description: "Traditional corporate style",
                preview: (
                  <div className="w-full h-full bg-white p-3 space-y-2">
                    <div className="border-b-4 border-blue-600 pb-2 mb-3">
                      <div className="h-4 bg-gray-800 rounded w-2/3 mb-1" />
                      <div className="flex gap-2">
                        <div className="h-1.5 bg-blue-200 rounded w-16" />
                        <div className="h-1.5 bg-blue-200 rounded w-16" />
                      </div>
                    </div>
                    <div className="h-2 bg-blue-600 rounded w-1/3 mb-1" />
                    <div className="h-1.5 bg-gray-200 rounded w-full" />
                    <div className="h-1.5 bg-gray-200 rounded w-5/6" />
                    <div className="h-2 bg-blue-600 rounded w-1/3 mt-2 mb-1" />
                    <div className="h-1.5 bg-gray-200 rounded w-full" />
                  </div>
                )
              },
              { 
                name: "Modern", 
                description: "Contemporary with subtle accents",
                preview: (
                  <div className="w-full h-full bg-white p-3 space-y-2">
                    <div className="flex gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-800 rounded w-2/3 mb-1" />
                        <div className="h-2 bg-gray-300 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded w-1/3 mb-1" />
                    <div className="h-1.5 bg-gray-200 rounded w-full" />
                    <div className="h-1.5 bg-gray-200 rounded w-4/5" />
                  </div>
                )
              },
              { 
                name: "ATS-Friendly", 
                description: "Optimized for tracking systems",
                preview: (
                  <div className="w-full h-full bg-white p-3 space-y-2">
                    <div className="h-4 bg-gray-900 rounded w-1/2 mb-2" />
                    <div className="flex gap-2 mb-3">
                      <div className="h-1.5 bg-gray-400 rounded w-20" />
                      <div className="h-1.5 bg-gray-400 rounded w-16" />
                      <div className="h-1.5 bg-gray-400 rounded w-24" />
                    </div>
                    <div className="h-2 bg-gray-900 rounded w-1/4 mb-1" />
                    <div className="border-t border-gray-300 pt-1" />
                    <div className="h-1.5 bg-gray-200 rounded w-full" />
                    <div className="h-1.5 bg-gray-200 rounded w-5/6" />
                    <div className="h-2 bg-gray-900 rounded w-1/4 mt-2 mb-1" />
                    <div className="border-t border-gray-300 pt-1" />
                    <div className="h-1.5 bg-gray-200 rounded w-full" />
                  </div>
                )
              },
              { 
                name: "Two-Column", 
                description: "Efficient space utilization",
                preview: (
                  <div className="w-full h-full flex">
                    <div className="w-1/3 bg-slate-800 p-2">
                      <div className="h-3 bg-white/80 rounded w-full mb-2" />
                      <div className="h-1.5 bg-white/40 rounded w-full mb-1" />
                      <div className="h-1.5 bg-white/40 rounded w-3/4 mb-2" />
                      <div className="h-2 bg-white/60 rounded w-1/2 mb-1" />
                      <div className="h-1.5 bg-white/40 rounded w-full mb-1" />
                      <div className="h-1.5 bg-white/40 rounded w-2/3" />
                    </div>
                    <div className="flex-1 bg-white p-2">
                      <div className="h-2 bg-slate-800 rounded w-1/2 mb-1" />
                      <div className="h-1.5 bg-gray-200 rounded w-full" />
                      <div className="h-1.5 bg-gray-200 rounded w-5/6" />
                      <div className="h-2 bg-slate-800 rounded w-1/2 mt-2 mb-1" />
                      <div className="h-1.5 bg-gray-200 rounded w-full" />
                    </div>
                  </div>
                )
              },
            ].map((template, index) => (
              <div 
                key={index}
                className="group relative bg-card rounded-xl border border-border overflow-hidden card-elevated cursor-pointer"
              >
                <div className="aspect-[8.5/11] bg-muted/50 p-4">
                  <div className="w-full h-full bg-background rounded border border-border overflow-hidden">
                    {template.preview}
                  </div>
                </div>
                <div className="p-4 border-t border-border">
                  <h3 className="font-semibold text-foreground">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/edit">
              <Button size="lg" variant="hero">
                Start with Any Template
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Create Your Resume in 3 Simple Steps
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Fill Your Details", description: "Enter your information using our intuitive form. Add education, experience, skills, and more." },
              { step: "2", title: "Customize & Preview", description: "Choose a template, adjust colors and fonts. See real-time preview as you make changes." },
              { step: "3", title: "Download & Apply", description: "Export to PDF or DOCX. Your resume is ready to send to employers." },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Build Your Resume?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of job seekers who have landed their dream jobs using ResuOne.
            </p>
            <Link to="/edit">
              <Button size="xl" variant="hero">
                Create Your Resume Now — Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">ResuOne</span>
            </div>
            
            <p className="text-muted-foreground max-w-md">
              Build professional resumes effortlessly. Free forever with no hidden costs.
            </p>

            {/* Project Attribution */}
            <div className="border-t border-border pt-6 w-full max-w-md">
              <p className="text-sm text-muted-foreground mb-4">
                Made as a minor project for college
              </p>
              
              <div className="space-y-2">
                <p className="font-medium text-foreground">Contact: Chetan Palta</p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <a 
                    href="mailto:itzchetan0007@gmail.com" 
                    className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    itzchetan0007@gmail.com
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/chetan-palta" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                  <a 
                    href="https://github.com/chetan-palta" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ResuOne. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
