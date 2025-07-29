import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BrainCircuit } from 'lucide-react';
import Image from 'next/image';
import SorcastChart from './sorcast-chart';

export default function SorcastPage() {
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
                <Input id="soil-ph" type="number" placeholder="e.g., 6.5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nitrogen">Soil Nitrogen (kg/ha)</Label>
                <Input id="nitrogen" type="number" placeholder="e.g., 80" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="planting-density">Planting Density (plants/ha)</Label>
                <Input id="planting-density" type="number" placeholder="e.g., 150000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sorghum-variety">Sorghum Variety</Label>
                <Select>
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
              <Button className="w-full mt-4">
                <BrainCircuit className="mr-2 h-4 w-4" />
                Predict Yield
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
              <Button variant="outline" className="w-full mt-4">Upload Image</Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="font-headline">Yield Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <SorcastChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
