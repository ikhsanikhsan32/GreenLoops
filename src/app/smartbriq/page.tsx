import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const steps = [
  {
    id: 'step-1',
    title: '1. Sorting Waste',
    content:
      'Separate sorghum waste (stalks, leaves) from other materials. Ensure the waste is clean and free from soil, rocks, or plastic contaminants for higher quality briquettes.',
    imageUrl: 'https://i.ibb.co/VvZg3d2/sorghum-waste.jpg',
    videoHint: 'sorghum waste',
  },
  {
    id: 'step-2',
    title: '2. Drying',
    content:
      'Reduce the moisture content of the sorghum waste to below 12%. This can be done by sun-drying for several days or using a mechanical dryer. Proper drying is crucial for efficient combustion.',
    imageUrl: 'https://i.ibb.co/YyLwGZc/drying-biomass.jpg',
    videoHint: 'drying biomass',
  },
  {
    id: 'step-3',
    title: '3. Carbonization (Pyrolysis)',
    content:
      'Heat the dried biomass in a low-oxygen environment (a pyrolysis kiln). This process, called carbonization, converts the biomass into char, which burns cleaner and longer.',
    imageUrl: 'https://i.ibb.co/qYn0M7s/pyrolysis-kiln.jpg',
    videoHint: 'pyrolysis kiln',
  },
  {
    id: 'step-4',
    title: '4. Grinding',
    content:
      'Grind the resulting char into a fine, uniform powder. A smaller particle size allows for better compaction and a denser, more durable briquette.',
    imageUrl: 'https://i.ibb.co/L51kL06/grinding-char.jpg',
    videoHint: 'grinding char',
  },
  {
    id: 'step-5',
    title: '5. Mixing with Binder',
    content:
      'Mix the char powder with a natural binder, such as starch or clay, at a ratio of about 10-20% binder to char. Add water to create a thick, consistent paste.',
    imageUrl: 'https://i.ibb.co/z5wQzV8/mixing-briquette-paste.jpg',
    videoHint: 'mixing briquette paste',
  },
  {
    id: 'step-6',
    title: '6. Briquetting/Pressing',
    content:
      'Feed the mixture into a briquette press. The machine will compact the material under high pressure to form dense briquettes. Various shapes can be produced depending on the die.',
    imageUrl: 'https://i.ibb.co/yQxY2Lg/briquette-press.jpg',
    videoHint: 'briquette press',
  },
  {
    id: 'step-7',
    title: '7. Final Drying',
    content:
      'Dry the freshly pressed briquettes to remove excess moisture from the binder. Sun-dry or use a low-temperature oven until they are hard and durable. They are now ready for use or sale.',
    imageUrl: 'https://i.ibb.co/5M5Vz9b/biomass-briquettes.jpg',
    videoHint: 'biomass briquettes',
  },
];

export default function SmartbriqPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline sm:text-5xl md:text-6xl">
          Smartbriq
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Your step-by-step guide to producing high-quality biomass briquettes from sorghum waste.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold font-headline">
            Production Process
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {steps.map((step) => (
              <AccordionItem key={step.id} value={step.id}>
                <AccordionTrigger className="text-lg font-semibold font-headline hover:no-underline">
                  {step.title}
                </AccordionTrigger>
                <AccordionContent className="text-base">
                  <div className="flex flex-col md:flex-row gap-4">
                     <div className="md:w-1/2">
                        <p>{step.content}</p>
                     </div>
                     <div className="md:w-1/2">
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                            <Image
                                src={step.imageUrl}
                                alt={step.title}
                                width={400}
                                height={225}
                                className="rounded-lg object-cover w-full h-full"
                                data-ai-hint={step.videoHint}
                            />
                        </div>
                     </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="flex flex-col gap-4">
           <Card>
            <CardHeader>
              <CardTitle className="font-headline">Performance Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  <strong>Moisture Matters:</strong> Keeping moisture content low (10-12%) is key to high energy output.
                </li>
                <li>
                  <strong>Binder Ratio:</strong> Don't use too much binder. It can reduce the briquette's energy value and increase smoke.
                </li>
                 <li>
                  <strong>Consistent Particle Size:</strong> A uniform powder ensures a stronger, denser briquette that burns evenly.
                </li>
                 <li>
                  <strong>High Pressure:</strong> Ensure your press machine provides adequate pressure for maximum density.
                </li>
                <li>
                  <strong>Proper Curing:</strong> Allow briquettes to dry completely to prevent them from crumbling or producing excess smoke.
                </li>
              </ul>
            </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
