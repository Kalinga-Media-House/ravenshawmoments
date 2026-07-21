'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface TrendChartProps {
  title: string;
  data: any[];
  xKey: string;
  yKey: string;
  type?: 'line' | 'area';
}

export function TrendChart({ title, data, xKey, yKey, type = 'line' }: TrendChartProps) {
  return (
    <Card className="col-span-full md:col-span-1 border-[#F5F5DC] bg-white">
      <CardHeader>
        <CardTitle className="text-[#800000]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey={xKey} stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #F5F5DC' }}
                itemStyle={{ color: '#800000' }}
              />
              <Area type="monotone" dataKey={yKey} stroke="#800000" fill="#800000" fillOpacity={0.2} />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey={xKey} stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #F5F5DC' }}
                itemStyle={{ color: '#800000' }}
              />
              <Line type="monotone" dataKey={yKey} stroke="#800000" strokeWidth={2} dot={{ fill: '#800000' }} activeDot={{ r: 6 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
