
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BrainCircuit, Loader } from 'lucide-react';
import { useState, useTransition } from 'react';
import { getYieldPrediction, type PredictionResult as ApiPredictionResult } from './actions';
import { useToast } from '@/hooks/use-toast';
import { type PredictSorghumYieldOutput } from '@/ai/types';

export default function SorcastPage() {
  const [soilPh, setSoilPh] = useState('6.5');
  const [nitrogen, setNitrogen] = useState('80');
  const [plantingDensity, setPlantingDensity] = useState('150000');
  const [sorghumVariety, setSorghumVariety] = useState('numbu');
  const [isPending, startTransition] = useTransition();
  const [prediction, setPrediction] = useState<PredictSorghumYieldOutput | null>(null);
  const { toast } = useToast();

  const handlePredict = () => {
    const input = {
      soilPh: parseFloat(soilPh),
      nitrogen: parseFloat(nitrogen),
      plantingDensity: parseFloat(plantingDensity),
      sorghumVariety,
    };

    if (isNaN(input.soilPh) || isNaN(input.nitrogen) || isNaN(input.plantingDensity)) {
       toast({
        title: "Invalid Input",
        description: "Please enter valid numbers for all parameters.",
        variant: 'destructive'
      })
      return;
    }

    startTransition(async () => {
      const result: ApiPredictionResult = await getYieldPrediction(input);
      if (result.error || !result.data) {
        toast({
          title: "Prediction Failed",
          description: result.error || "An unknown error occurred.",
          variant: 'destructive'
        })
        setPrediction(null);
      } else {
        setPrediction(result.data);
         toast({
          title: "Prediction Successful",
          description: `Predicted yield is ${result.data.predictedYield.toFixed(2)} t/ha.`,
        })
      }
    });
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline sm:text-5xl md:text-6xl">
          SORCAST
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Sorghum Yield Prediction & Biomass Allocation. Input your data for AI-powered forecasts that optimize the entire plant for a zero-waste strategy.
        </p>
      </div>

      <div className="grid gap-8 max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Input Parameters</CardTitle>
              <CardDescription>Enter the details below to get a prediction.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="soil-ph">Soil pH</Label>
                <Input id="soil-ph" type="number" placeholder="e.g., 6.5" value={soilPh} onChange={(e) => setSoilPh(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nitrogen">Soil Nitrogen (kg/ha)</Label>
                <Input id="nitrogen" type="number" placeholder="e.g., 80" value={nitrogen} onChange={(e) => setNitrogen(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="planting-density">Planting Density (plants/ha)</Label>
                <Input id="planting-density" type="number" placeholder="e.g., 150000" value={plantingDensity} onChange={(e) => setPlantingDensity(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sorghum-variety">Sorghum Variety</Label>
                <Select value={sorghumVariety} onValueChange={setSorghumVariety}>
                  <SelectTrigger id="sorghum-variety">
                    <SelectValue placeholder="Select variety" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="numbu">Numbu</SelectItem>
                    <SelectItem value="super-1">Super 1</SelectItem>
                    <SelectItem value="kawali">Kawali</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full mt-4" onClick={handlePredict} disabled={isPending}>
                {isPending ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
                {isPending ? 'Predicting...' : 'Predict Yield & Allocation'}
              </Button>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
