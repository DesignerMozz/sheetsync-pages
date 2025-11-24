import { HeroSection } from "@/components/HeroSection";
import { GoogleSheetsIntegration } from "@/components/GoogleSheetsIntegration";
import { SetupInstructions } from "@/components/SetupInstructions";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      
      <div className="max-w-6xl mx-auto px-4 pb-20 space-y-12">
        <section id="integration" className="scroll-mt-20">
          <GoogleSheetsIntegration />
        </section>
        
        <SetupInstructions />
      </div>
      
      <footer className="border-t border-border/50 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Built with React + Vite • Optimized for GitHub Pages • No backend required</p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
