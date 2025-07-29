// src/app/sorcast/biomass-allocation-chart.tsx
'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

type BiomassAllocationChartProps = {
  data: { name: string; value: number; fill: string }[];
};

const chartConfig = {
  value: {
    label: 'Percentage',
  },
  grains: {
    label: 'Grains (Food)',
    color: 'hsl(var(--chart-1))',
  },
  stalksAndLeaves: {
    label: 'Stalks/Leaves (Briquettes)',
    color: 'hsl(var(--chart-2))',
  },
  residualBiomass: {
    label: 'Residual (Bioethanol/Fertilizer)',
    color: 'hsl(var(--chart-3))',
  },
}


export default function BiomassAllocationChart({ data }: BiomassAllocationChartProps) {
    if (!data || data.length === 0) {
        return <div className="flex items-center justify-center h-full text-muted-foreground">No data to display</div>;
    }
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            dataKey="value"
            nameKey="name"
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (
                    <text x={x} y={y} fill="currentColor" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs fill-foreground">
                    {`${(percent * 100).toFixed(0)}%`}
                    </text>
                );
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Legend content={<ChartLegend content={<ChartLegendContent nameKey="name"/>} />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
