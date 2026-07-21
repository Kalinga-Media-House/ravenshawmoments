'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DistributionPieProps {
  title: string;
  data: any[];
  nameKey: string;
  dataKey: string;
  colors?: string[];
}

const DEFAULT_COLORS = ['#800000', '#B30000', '#D94C4C', '#F29999', '#F5F5DC', '#D4AF37'];

export function DistributionPie({ title, data, nameKey, dataKey, colors = DEFAULT_COLORS }: DistributionPieProps) {
  return (
    <Card className="col-span-full md:col-span-1 border-[#F5F5DC] bg-white">
      <CardHeader>
        <CardTitle className="text-[#800000]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey={dataKey}
              nameKey={nameKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #F5F5DC' }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
