
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
  const [landArea, setLandArea] = useState('10');
  const [farmingTechnique, setFarmingTechnique] = useState('conventional');
  const [plantingDistance, setPlantingDistance] = useState('75cm x 25cm');
  const [harvestData, setHarvestData] = useState(['3.2', '3.5', '3.3', '3.6', '3.4']);
  const [isPending, startTransition] = useTransition();
  const [prediction, setPrediction] = useState<PredictSorghumYieldOutput | null>(null);
  const { toast } = useToast();

  const handleHarvestDataChange = (index: number, value: string) => {
    const newHarvestData = [...harvestData];
    newHarvestData[index] = value;
    setHarvestData(newHarvestData);
  }

  const handlePredict = () => {
    const historicalHarvestData = harvestData.map(d => parseFloat(d)).filter(d => !isNaN(d));

    if (historicalHarvestData.length !== 5) {
      toast({
        title: "Input Tidak Lengkap",
        description: "Silakan masukkan data panen untuk 5 tahun terakhir.",
        variant: 'destructive'
      });
      return;
    }

    const input = {
      landArea: parseFloat(landArea),
      farmingTechnique,
      plantingDistance,
      historicalHarvestData,
    };

    if (isNaN(input.landArea)) {
       toast({
        title: "Input Tidak Valid",
        description: "Silakan masukkan angka yang valid untuk semua parameter.",
        variant: 'destructive'
      })
      return;
    }

    startTransition(async () => {
      const result: ApiPredictionResult = await getYieldPrediction(input);
      if (result.error || !result.data) {
        toast({
          title: "Prediksi Gagal",
          description: result.error || "Terjadi kesalahan yang tidak diketahui.",
          variant: 'destructive'
        })
        setPrediction(null);
      } else {
        setPrediction(result.data);
         toast({
          title: "Prediksi Berhasil",
          description: `Prediksi hasil panen adalah ${result.data.predictedYield.toFixed(2)} t/ha.`,
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
          Prediksi Hasil Panen Sorgum & Alokasi Biomassa. Masukkan data Anda untuk perkiraan berbasis AI yang mengoptimalkan seluruh tanaman untuk strategi tanpa limbah.
        </p>
      </div>

      <div className="grid gap-8 max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Parameter Input</CardTitle>
              <CardDescription>Masukkan detail di bawah ini untuk mendapatkan prediksi.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="land-area">Luas Lahan (ha)</Label>
                <Input id="land-area" type="number" placeholder="e.g., 10" value={landArea} onChange={(e) => setLandArea(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="farming-technique">Teknik Pertanian</Label>
                <Select value={farmingTechnique} onValueChange={setFarmingTechnique}>
                  <SelectTrigger id="farming-technique">
                    <SelectValue placeholder="Pilih teknik" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conventional">Konvensional</SelectItem>
                    <SelectItem value="organic">Organik</SelectItem>
                    <SelectItem value="conservation">Tani Konservasi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="planting-distance">Jarak Tanam</Label>
                <Input id="planting-distance" type="text" placeholder="e.g., 75cm x 25cm" value={plantingDistance} onChange={(e) => setPlantingDistance(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Data Panen 5 Tahun Terakhir (t/ha)</Label>
                <div className="grid grid-cols-5 gap-2">
                  {harvestData.map((data, index) => (
                    <Input 
                      key={index} 
                      type="number" 
                      placeholder={`Tahun ${index + 1}`} 
                      value={data} 
                      onChange={(e) => handleHarvestDataChange(index, e.target.value)}
                    />
                  ))}
                </div>
              </div>
              <Button className="w-full mt-4" onClick={handlePredict} disabled={isPending}>
                {isPending ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
                {isPending ? 'Memprediksi...' : 'Prediksi Hasil & Alokasi'}
              </Button>
            </CardContent>
          </Card>

           {prediction && (
            <Card className="animate-in fade-in-50">
                <CardHeader>
                    <CardTitle className="font-headline">Hasil Prediksi</CardTitle>
                    <CardDescription>Hasil dari model AI Sorcast.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-4 bg-muted rounded-lg">
                            <Label className="text-sm text-muted-foreground">Prediksi Hasil Panen</Label>
                            <p className="text-2xl font-bold text-primary">{prediction.predictedYield.toFixed(2)} t/ha</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <Label className="text-sm text-muted-foreground">Rata-rata Historis</Label>
                            <p className="text-2xl font-bold">{prediction.historicalAverage.toFixed(2)} t/ha</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
           )}
      </div>
    </div>
  );
}
