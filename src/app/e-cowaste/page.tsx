'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const products = [
  {
    name: 'Premium Sorghum Briquettes',
    price: 'Rp 2,500',
    weight: 'per kg',
    origin: 'West Java',
    carbonValue: '1.6 kg CO₂e saved/kg',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    name: 'High-Density Biomass Blocks',
    price: 'Rp 2,200',
    weight: 'per kg',
    origin: 'Central Java',
    carbonValue: '1.5 kg CO₂e saved/kg',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    name: 'Eco-Friendly Fuel Bricks',
    price: 'Rp 2,350',
    weight: 'per kg',
    origin: 'East Java',
    carbonValue: '1.55 kg CO₂e saved/kg',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    name: 'Standard Sorghum Briquettes',
    price: 'Rp 2,000',
    weight: 'per kg',
    origin: 'Banten',
    carbonValue: '1.4 kg CO₂e saved/kg',
    imageUrl: 'https://placehold.co/600x400.png',
  },
];

export default function ECowastePage() {
  const [weight, setWeight] = useState('');
  const [emissions, setEmissions] = useState<number | null>(null);

  const handleCalculate = () => {
    const numericWeight = parseFloat(weight);
    if (!isNaN(numericWeight) && numericWeight > 0) {
      setEmissions(numericWeight * 1.5); // 1.5 kg CO2e saved per kg of briquettes
    } else {
        setEmissions(null);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline sm:text-5xl md:text-6xl">
          E-Cowaste Marketplace
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Buy and sell certified biomass briquettes. Together, we can build a
          sustainable future.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold font-headline mb-6">
            Featured Products
          </h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <Card key={product.name} className="flex flex-col">
                <CardHeader className="p-0">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={600}
                    height={400}
                    className="rounded-t-lg object-cover aspect-video"
                    data-ai-hint="biomass briquettes"
                  />
                </CardHeader>
                <CardContent className="pt-4 flex-grow">
                  <h3 className="text-lg font-bold font-headline">{product.name}</h3>
                  <p className="text-muted-foreground text-sm">{product.origin}</p>
                  <p className="text-sm mt-2">{product.carbonValue}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold text-primary">{product.price}</p>
                    <p className="text-xs text-muted-foreground">{product.weight}</p>
                  </div>
                  <Button variant="outline">View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        <div className="lg:col-span-1 space-y-8">
            <Button size="lg" className="w-full">List Your Product</Button>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Calculator className="w-5 h-5" /> Carbon Calculator</CardTitle>
                    <CardDescription>Estimate your environmental impact.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="weight">Briquette Weight (kg)</Label>
                        <Input id="weight" type="number" placeholder="e.g., 100" value={weight} onChange={(e) => setWeight(e.target.value)} />
                    </div>
                    <Button className="w-full" onClick={handleCalculate}>Calculate Savings</Button>
                    {emissions !== null && (
                        <div className="text-center pt-4">
                            <p className="text-muted-foreground">Estimated Emissions Reduction:</p>
                            <p className="text-2xl font-bold text-primary">{emissions.toFixed(2)} kg CO₂e</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
