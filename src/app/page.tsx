import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BarChart3, Leaf, Store } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      title: 'SORCAST',
      description:
        'Predict sorghum yield with our ML-powered tool using environmental and satellite data.',
      href: '/sorcast',
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
    },
    {
      title: 'Smartbriq',
      description:
        'Step-by-step guidance for producing high-quality biomass briquettes from sorghum waste.',
      href: '/smartbriq',
      icon: <Leaf className="w-8 h-8 text-primary" />,
    },
    {
      title: 'E-Cowaste',
      description:
        'A digital marketplace to buy, sell, and assess quality of biomass briquettes.',
      href: '/e-cowaste',
      icon: <Store className="w-8 h-8 text-primary" />,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 text-center bg-card">
        <div className="container px-4 md:px-6">
           <Image
              src="https://i.ibb.co/M5h4NLf/Group-11.png"
              alt="GreenLoops Logo"
              width={400}
              height={100}
              className="mx-auto"
              priority
            />
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl my-4">
            Powering Sustainable Agro-industrial Waste Utilization in Indonesia.
          </p>
          <div className="mt-6">
            <Link href="#features">
              <Button size="lg">Explore Features</Button>
            </Link>
          </div>
        </div>
      </section>
      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl font-headline">
            Our Core Features
          </h2>
          <p className="mx-auto max-w-[700px] text-center text-muted-foreground md:text-xl mt-4 mb-12">
            Innovative tools designed to create a circular economy for
            agricultural waste.
          </p>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="flex flex-col hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="flex flex-col items-center text-center">
                  {feature.icon}
                  <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex items-end justify-center">
                  <Link href={feature.href} className="w-full">
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
