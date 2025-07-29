'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';


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
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
          <Line
            dataKey="historical"
            type="monotone"
            stroke="var(--color-historical)"
            strokeWidth={2}
            dot={true}
            connectNulls
          />
          <Line
            dataKey="predicted"
            type="monotone"
            stroke="var(--color-predicted)"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={true}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
