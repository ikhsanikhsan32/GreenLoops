import QualityAnalyzer from "./quality-analyzer";

export default function QualityAssessmentPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline sm:text-5xl md:text-6xl">
          AI Briquette Quality Assessment
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload an image of your biomass briquette to get an instant quality analysis and price suggestion powered by AI.
        </p>
      </div>
      <QualityAnalyzer />
    </div>
  );
}
