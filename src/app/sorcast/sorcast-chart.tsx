'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';


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

type SorcastChartProps = {
    data: any[];
}

export default function SorcastChart({ data }: SorcastChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-full">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
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
          <Bar
            dataKey="historical"
            fill="var(--color-historical)"
            radius={4}
          />
          <Bar
            dataKey="predicted"
            fill="var(--color-predicted)"
            radius={4}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
