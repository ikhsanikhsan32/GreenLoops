'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const chartData = [
  { year: '2019', historical: 2.8, predicted: null },
  { year: '2020', historical: 3.5, predicted: null },
  { year: '2021', historical: 3.2, predicted: null },
  { year: '2022', historical: 4.1, predicted: null },
  { year: '2023', historical: 3.8, predicted: null },
  { year: '2024', historical: null, predicted: 4.5 },
];

const chartConfig = {
  historical: {
    label: 'Historical Yield',
    color: 'hsl(var(--chart-1))',
  },
  predicted: {
    label: 'Predicted Yield',
    color: 'hsl(var(--chart-2))',
  },
};

export default function SorcastChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 20,
          left: 10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="year"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          unit=" t/ha"
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Legend content={<ChartLegend content={<ChartLegendContent />} />} />
        <Line
          dataKey="historical"
          type="monotone"
          stroke="var(--color-historical)"
          strokeWidth={2}
          dot={true}
        />
        <Line
          dataKey="predicted"
          type="monotone"
          stroke="var(--color-predicted)"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={true}
        />
      </LineChart>
    </ChartContainer>
  );
}
