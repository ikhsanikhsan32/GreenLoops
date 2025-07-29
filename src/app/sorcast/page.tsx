
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
import { BrainCircuit, Loader, Map, Upload, Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { getYieldPrediction, type PredictionResult as ApiPredictionResult } from './actions';
import { useToast } from '@/hooks/use-toast';
import { type PredictSorghumYieldOutput } from '@/ai/types';
import BiomassAllocationChart from './biomass-allocation-chart';
import SorcastChart from './sorcast-chart';
import Image from 'next/image';

export default function SorcastPage() {
  const [landArea, setLandArea] = useState('10');
  const [farmingTechnique, setFarmingTechnique] = useState('conventional');
  const [plantingDistance, setPlantingDistance] = useState('75cm x 25cm');
  const [harvestData, setHarvestData] = useState(['3.2', '3.5', '3.3', '3.6', '3.4']);
  const [satelliteImageUri, setSatelliteImageUri] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [prediction, setPrediction] = useState<PredictSorghumYieldOutput | null>(null);
  const { toast } = useToast();

  const handleHarvestDataChange = (index: number, value: string) => {
    const newHarvestData = [...harvestData];
    newHarvestData[index] = value;
    setHarvestData(newHarvestData);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 4MB.",
          variant: 'destructive'
        })
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setSatelliteImageUri(e.target?.result as string);
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
  
  const handleResetImage = () => {
    setSatelliteImageUri(null);
    const fileInput = document.getElementById('satellite-image') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }


  const handlePredict = () => {
    const historicalHarvestData = harvestData.map(d => parseFloat(d)).filter(d => !isNaN(d));

    if (historicalHarvestData.length !== 5) {
      toast({
        title: "Incomplete Input",
        description: "Please enter harvest data for the last 5 years.",
        variant: 'destructive'
      });
      return;
    }

    const input = {
      landArea: parseFloat(landArea),
      farmingTechnique,
      plantingDistance,
      historicalHarvestData,
      satelliteImageUri: satelliteImageUri ?? undefined,
    };

    if (isNaN(input.landArea)) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number for all parameters.",
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
          description: `The predicted yield is ${result.data.predictedYield.toFixed(2)} t/ha.`,
        })
      }
    });
  };

  const biomassChartData = prediction ? [
    { name: 'Grains (Food)', value: prediction.biomassAllocation.grains, fill: 'hsl(var(--chart-1))' },
    { name: 'Stalks/Leaves (Briquettes)', value: prediction.biomassAllocation.stalksAndLeaves, fill: 'hsl(var(--chart-2))' },
    { name: 'Residual (Bioethanol/Fertilizer)', value: prediction.biomassAllocation.residualBiomass, fill: 'hsl(var(--chart-3))' },
  ] : [];

  const yieldChartData = prediction ? [
    ...harvestData.map((yieldStr, index) => ({
      year: `Year ${index - 4}`,
      historical: parseFloat(yieldStr)
    })),
    {
      year: 'Predicted',
      predicted: prediction.predictedYield,
      historical: null,
    }
  ] : harvestData.map((yieldStr, index) => ({
      year: `Year ${index - 4}`,
      historical: parseFloat(yieldStr)
  }));

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline sm:text-5xl md:text-6xl">
          SORCAST
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Sorghum Yield Prediction & Biomass Allocation. Input your data for an AI-driven forecast that optimizes the entire plant for a zero-waste strategy.
        </p>
      </div>

      <div className="space-y-8">
        <div className="grid lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                <CardTitle className="font-headline">Input Parameters</CardTitle>
                <CardDescription>Enter the details below to get a prediction.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="land-area">Land Area (ha)</Label>
                    <Input id="land-area" type="number" placeholder="e.g., 10" value={landArea} onChange={(e) => setLandArea(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="farming-technique">Farming Technique</Label>
                    <Select value={farmingTechnique} onValueChange={setFarmingTechnique}>
                    <SelectTrigger id="farming-technique">
                        <SelectValue placeholder="Select technique" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="conventional">Conventional</SelectItem>
                        <SelectItem value="organic">Organic</SelectItem>
                        <SelectItem value="conservation">Conservation Tillage</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="planting-distance">Planting Distance</Label>
                    <Input id="planting-distance" type="text" placeholder="e.g., 75cm x 25cm" value={plantingDistance} onChange={(e) => setPlantingDistance(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Last 5 Years Harvest Data (t/ha)</Label>
                    <div className="grid grid-cols-5 gap-2">
                    {harvestData.map((data, index) => (
                        <Input
                        key={index}
                        type="number"
                        placeholder={`Year ${index + 1}`}
                        value={data}
                        onChange={(e) => handleHarvestDataChange(index, e.target.value)}
                        />
                    ))}
                    </div>
                </div>
                </CardContent>
            </Card>
            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Map className="w-5 h-5"/>
                        Satellite Image Analysis (Optional)
                    </CardTitle>
                    <CardDescription>Upload an image for more accurate AI analysis.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden group">
                        <Image 
                            src={satelliteImageUri || "https://i.ibb.co/b3sY9gD/picture3.jpg"} 
                            alt="Satellite image preview"
                            width={1280}
                            height={720}
                            className="transition-all duration-300 group-hover:scale-105 object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4 p-4 transition-all duration-300 opacity-0 group-hover:opacity-100">
                            <div className="text-center text-white">
                                <h3 className="text-lg font-bold font-headline">Analyze Your Land</h3>
                                <p className="text-sm text-white/80">Upload a satellite or drone image of your land.</p>
                            </div>
                            <div className="flex gap-2">
                                <Label htmlFor="satellite-image" className="flex-grow">
                                    <Input id="satellite-image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                    <Button asChild variant="secondary" className="cursor-pointer">
                                        <div>
                                            <Upload className="w-4 h-4 mr-2"/>
                                            Upload Image
                                        </div>
                                    </Button>
                                </Label>
                                {satelliteImageUri && <Button variant="destructive" size="icon" onClick={handleResetImage}><Trash2 className="w-4 h-4"/></Button>}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        
        <Button className="w-full" size="lg" onClick={handlePredict} disabled={isPending}>
            {isPending ? <Loader className="w-5 h-5 mr-2 animate-spin" /> : <BrainCircuit className="w-5 h-5 mr-2" />}
            {isPending ? 'Predicting...' : 'Predict Yield & Allocation'}
        </Button>
        
        {(isPending || prediction) && (
            <Card>
                <CardHeader>
                <CardTitle className="font-headline">Prediction Dashboard</CardTitle>
                <CardDescription>Results from the Sorcast AI model.</CardDescription>
                </CardHeader>
                <CardContent>
                {isPending && (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                        <Loader className="w-10 h-10 animate-spin mb-4" />
                        <p>Running prediction...</p>
                    </div>
                )}
                {!isPending && !prediction && (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                        <BrainCircuit className="w-10 h-10 mb-4" />
                        <p>Prediction results will be displayed here.</p>
                    </div>
                )}
                {prediction && (
                    <div className="space-y-6 animate-in fade-in-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-muted rounded-lg">
                                <Label className="text-sm text-muted-foreground">Predicted Yield</Label>
                                <p className="text-2xl font-bold text-primary">{prediction.predictedYield.toFixed(2)} t/ha</p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                                <Label className="text-sm text-muted-foreground">Historical Average</Label>
                                <p className="text-2xl font-bold">{prediction.historicalAverage.toFixed(2)} t/ha</p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                                <Label className="text-sm text-muted-foreground">Confidence Score</Label>
                                <p className="text-2xl font-bold text-primary">{(prediction.confidence * 100).toFixed(0)}%</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                            <CardHeader>
                                    <CardTitle className="font-headline text-lg">Biomass Allocation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                    <BiomassAllocationChart data={biomassChartData} />
                            </CardContent>
                            </Card>
                            <Card>
                            <CardHeader>
                                    <CardTitle className="font-headline text-lg">Yield Trend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                    <SorcastChart data={yieldChartData} />
                            </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
