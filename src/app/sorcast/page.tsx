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
import { BrainCircuit, Loader, AreaChart } from 'lucide-react';
import Image from 'next/image';
import SorcastChart from './sorcast-chart';
import { useState, useTransition } from 'react';
import { getYieldPrediction } from './actions';
import { useToast } from '@/hooks/use-toast';

export type PredictionResult = {
  predictedYield?: number;
  historicalAverage?: number;
  confidence?: number;
};

export default function SorcastPage() {
  const [soilPh, setSoilPh] = useState('6.5');
  const [nitrogen, setNitrogen] = useState('80');
  const [plantingDensity, setPlantingDensity] = useState('150000');
  const [sorghumVariety, setSorghumVariety] = useState('numbu');
  const [isPending, startTransition] = useTransition();
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
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
      const result = await getYieldPrediction(input);
      if (result.error) {
        toast({
          title: "Prediction Failed",
          description: result.error,
          variant: 'destructive'
        })
        setPrediction(null);
      } else {
        setPrediction(result.data!);
      }
    });
  };

  const chartData = [
    { year: '2019', historical: 2.8, predicted: null },
    { year: '2020', historical: 3.5, predicted: null },
    { year: '2021', historical: 3.2, predicted: null },
    { year: '2022', historical: 4.1, predicted: null },
    { year: '2023', historical: 3.8, predicted: null },
    { year: '2024', historical: null, predicted: prediction?.predictedYield ?? null },
  ];


  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline sm:text-5xl md:text-6xl">
          SORCAST
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Sorghum Yield Prediction Tool. Input your data to get AI-powered
          yield forecasts.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Input Parameters</CardTitle>
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
                {isPending ? <Loader className="animate-spin" /> : <BrainCircuit />}
                {isPending ? 'Predicting...' : 'Predict Yield'}
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Remote Sensing Imagery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                 <Image
                    src="https://placehold.co/600x400.png"
                    alt="Satellite image of farmland"
                    width={600}
                    height={400}
                    className="rounded-md object-cover"
                    data-ai-hint="satellite farmland"
                  />
              </div>
              <Button variant="outline" className="w-full mt-4" disabled>Upload Image (Coming Soon)</Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline">Yield Visualization</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <div className="flex-grow">
                 <SorcastChart data={chartData} />
              </div>
             
              {isPending && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
                  <Loader className="w-12 h-12 text-primary animate-spin" />
                </div>
              )}

              {!isPending && !prediction && (
                <div className="text-center text-muted-foreground p-8 flex flex-col items-center justify-center h-full">
                  <AreaChart className="w-12 h-12 mb-4" />
                  <p>Prediction results will appear here after you click "Predict Yield".</p>
                </div>
              )}
              
              {prediction && (
                <CardFooter className="flex-wrap gap-4 pt-6">
                  <div className="flex-1 min-w-[200px] p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Predicted Yield (2024)</p>
                    <p className="text-2xl font-bold text-primary">{prediction.predictedYield?.toFixed(2)} t/ha</p>
                  </div>
                  <div className="flex-1 min-w-[200px] p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">5-Year Historical Average</p>
                    <p className="text-2xl font-bold">{prediction.historicalAverage?.toFixed(2)} t/ha</p>
                  </div>
                   <div className="flex-1 min-w-[200px] p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Confidence Level</p>
                    <p className="text-2xl font-bold">{((prediction.confidence ?? 0) * 100).toFixed(0)}%</p>
                  </div>
                </CardFooter>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
