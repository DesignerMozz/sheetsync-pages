import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, FileText, Upload, Eye } from "lucide-react";

export const SetupInstructions = () => {
  const steps = [
    {
      icon: FileText,
      title: "Create Your Google Sheet",
      description: "Open Google Sheets and create your data table with headers in the first row."
    },
    {
      icon: Eye,
      title: "Make It Public",
      description: "Click 'Share' → 'Change to anyone with the link' → 'Viewer' access. Copy the sheet URL."
    },
    {
      icon: Upload,
      title: "Connect Here",
      description: "Paste your Google Sheet URL in the input field above and click 'Load Data'."
    },
    {
      icon: CheckCircle2,
      title: "Deploy to GitHub Pages",
      description: "Push to GitHub, enable Pages in repo settings, and your dashboard is live!"
    }
  ];

  return (
    <Card className="shadow-medium border-border/50">
      <CardHeader>
        <CardTitle>Setup Guide</CardTitle>
        <CardDescription>
          Follow these simple steps to get your dashboard running
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={index}
                className="relative p-6 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold shadow-medium">
                  {index + 1}
                </div>
                <Icon className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
