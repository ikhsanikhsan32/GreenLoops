
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
import { BrainCircuit, Loader, AreaChart, PieChart, Info } from 'lucide-react';
import Image from 'next/image';
import SorcastChart from './sorcast-chart';
import { useState, useTransition } from 'react';
import { getYieldPrediction, type PredictionResult as ApiPredictionResult } from './actions';
import { useToast } from '@/hooks/use-toast';
import { type PredictSorghumYieldOutput } from '@/ai/types';
import BiomassAllocationChart from './biomass-allocation-chart';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

 const biomassChartData = prediction?.biomassAllocation ? [
    { name: 'Grains (Food)', value: prediction.biomassAllocation.grains, fill: 'hsl(var(--chart-1))' },
    { name: 'Stalks/Leaves (Briquettes)', value: prediction.biomassAllocation.stalksAndLeaves, fill: 'hsl(var(--chart-2))' },
    { name: 'Residual (Bioethanol/Fertilizer)', value: prediction.biomassAllocation.residualBiomass, fill: 'hsl(var(--chart-3))' },
 ] : [];


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
                {isPending ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
                {isPending ? 'Predicting...' : 'Predict Yield & Allocation'}
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

        <div className="lg:col-span-2 space-y-8">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline">Prediction Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col relative">
                
              {(isPending || !prediction) && (
                 <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg z-10">
                   {isPending ? (
                      <Loader className="w-12 h-12 text-primary animate-spin" />
                   ) : (
                      <div className="text-center text-muted-foreground p-8 flex flex-col items-center justify-center h-full">
                        <AreaChart className="w-12 h-12 mb-4" />
                        <p>Prediction results will appear here.</p>
                      </div>
                   )}
                 </div>
              )}
              
              <div className={`transition-opacity duration-300 ${isPending ? 'opacity-20' : 'opacity-100'}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Predicted Yield (2024)</p>
                        <p className="text-2xl font-bold text-primary">{prediction?.predictedYield?.toFixed(2) ?? 'N/A'} t/ha</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">5-Year Historical Avg.</p>
                        <p className="text-2xl font-bold">{prediction?.historicalAverage?.toFixed(2) ?? 'N/A'} t/ha</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Confidence Level</p>
                        <p className="text-2xl font-bold">{prediction ? `${((prediction.confidence) * 100).toFixed(0)}%` : 'N/A'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-headline text-lg mb-2">Yield Visualization</h3>
                        <div className="h-[250px]">
                           <SorcastChart data={chartData} />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-headline text-lg mb-2">Biomass Allocation</h3>
                        <div className="h-[250px] flex items-center justify-center">
                           {prediction ? <BiomassAllocationChart data={biomassChartData} /> : <PieChart className="w-12 h-12 text-muted-foreground"/>}
                        </div>
                    </div>
                </div>

                <Alert className="mt-8">
                  <Info className="h-4 w-4" />
                  <AlertTitle className="font-headline">Model Insights</AlertTitle>
                  <AlertDescription>
                   Our model uses a Random Forest Regressor and LSTM for time-series analysis, providing accurate, interpretable yield forecasts to support sustainable bioenergy production.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
