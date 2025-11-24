import { Database, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-subtle -z-10" />
      
      <div className="max-w-6xl mx-auto text-center space-y-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
          <Database className="h-4 w-4" />
          <span>Google Sheets Integration</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-primary leading-tight">
          Data Dashboard
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Connect your Google Sheets and visualize data beautifully. 
          Built for GitHub Pages with zero backend required.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Button 
            size="lg" 
            className="bg-gradient-primary hover:opacity-90 transition-all shadow-medium hover:shadow-strong"
            onClick={() => document.getElementById('integration')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get Started
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-2 hover:bg-muted/50"
            onClick={() => window.open('https://github.com', '_blank')}
          >
            <Github className="mr-2 h-5 w-5" />
            View on GitHub
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto">
          {[
            { title: "No Backend", description: "Pure static site, perfect for GitHub Pages" },
            { title: "Real-time Data", description: "Fetch live data from Google Sheets" },
            { title: "Easy Setup", description: "Just paste your sheet URL and go" }
          ].map((feature, index) => (
            <div 
              key={index}
              className="p-6 bg-card rounded-xl shadow-soft hover:shadow-medium transition-all border border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="font-semibold text-lg mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
