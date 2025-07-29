'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, Upload, Loader, FileImage, BarChart, Tag, List, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useTransition } from 'react';
import { getBriquetteQualityAnalysis, type AnalysisResult } from './actions';

export default function QualityAnalyzer() {
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if(file.size > 4 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 4MB.",
          variant: 'destructive'
        })
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoDataUri(e.target?.result as string);
        setAnalysisResult(null);
      };
      reader.onerror = () => {
         toast({
          title: "Error reading file",
          description: "There was an issue reading your file. Please try again.",
          variant: 'destructive'
        })
      }
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (!photoDataUri) {
      toast({
        title: "No image selected",
        description: "Please upload an image to analyze.",
        variant: 'destructive'
      })
      return;
    }

    startTransition(async () => {
      const result = await getBriquetteQualityAnalysis({ photoDataUri });
      setAnalysisResult(result);
      if (result.error) {
        toast({
            title: "Analysis Failed",
            description: result.error,
            variant: 'destructive'
        })
      }
    });
  };

  const handleReset = () => {
    setPhotoDataUri(null);
    setAnalysisResult(null);
    const fileInput = document.getElementById('briquette-photo') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }

  const qualityScore = analysisResult?.data?.qualityScore ?? 0;

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Upload Briquette Image</CardTitle>
          <CardDescription>Select a clear photo of a single briquette.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
            {photoDataUri ? (
              <Image src={photoDataUri} alt="Briquette preview" layout="fill" objectFit="contain" />
            ) : (
                <div className="text-center text-muted-foreground flex flex-col items-center">
                    <FileImage className="w-12 h-12 mb-2"/>
                    <p>Image preview will appear here</p>
                </div>
            )}
          </div>
          <div className="flex gap-2">
            <Label htmlFor="briquette-photo" className="flex-grow">
              <Input id="briquette-photo" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <Button asChild variant="outline" className="w-full cursor-pointer">
                <div>
                  <Upload className="w-4 h-4 mr-2"/>
                  Choose File
                </div>
              </Button>
            </Label>
            {photoDataUri && <Button variant="ghost" size="icon" onClick={handleReset}><Trash2 className="w-4 h-4 text-destructive"/></Button>}
          </div>

          <Button onClick={handleAnalyze} disabled={isPending || !photoDataUri} className="w-full">
            {isPending ? <Loader className="w-4 h-4 mr-2 animate-spin"/> : <CheckCircle className="w-4 h-4 mr-2"/>}
            {isPending ? 'Analyzing...' : 'Analyze Quality'}
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Analysis Results</CardTitle>
          <CardDescription>AI-powered assessment of your briquette.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isPending && (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Loader className="w-10 h-10 animate-spin mb-4" />
                <p>Analyzing image...</p>
             </div>
          )}
          {!isPending && !analysisResult && (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <BarChart className="w-10 h-10 mb-4" />
                <p>Results will be displayed here.</p>
             </div>
          )}
          {analysisResult?.data && (
            <div className="space-y-4 animate-in fade-in-50">
                <div>
                    <Label className="flex items-center gap-2 mb-2"><BarChart className="w-4 h-4"/>Quality Score</Label>
                    <div className="flex items-center gap-4">
                        <Progress value={qualityScore * 100} className="w-full h-3"/>
                        <span className="font-bold text-lg text-primary">{Math.round(qualityScore * 100)}/100</span>
                    </div>
                </div>
                <div>
                    <Label className="flex items-center gap-2 mb-2"><List className="w-4 h-4"/>Quality Factors</Label>
                    <ul className="list-disc list-inside bg-muted p-3 rounded-md text-sm space-y-1">
                        {analysisResult.data.qualityFactors.map((factor, index) => <li key={index}>{factor}</li>)}
                    </ul>
                </div>
                <div>
                    <Label className="flex items-center gap-2 mb-2"><Tag className="w-4 h-4"/>Suggested Price Range</Label>
                    <p className="text-xl font-bold text-primary bg-muted p-3 rounded-md text-center">{analysisResult.data.suggestedPriceRange}</p>
                </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
