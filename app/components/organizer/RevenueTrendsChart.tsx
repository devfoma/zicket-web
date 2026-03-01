'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
export interface RevenueDataPoint {
  date: string;
  value: number;
}

interface RevenueTrendsProps {
  data?: RevenueDataPoint[];
  onPeriodChange?: (period: string) => void;
}

const defaultData: RevenueDataPoint[] = [
  { date: 'Jun 08', value: 5000 },
  { date: 'Jun 10', value: 22000 },
  { date: 'Jun 12', value: 18000 },
  { date: 'Jun 14', value: 48000 },
  { date: 'Jun 16', value: 150030 },
  { date: 'Jun 18', value: 95000 },
  { date: 'Jun 20', value: 60000 },
  { date: 'Jun 22', value: 55000 },
  { date: 'Jun 24', value: 45000 },
  { date: 'Jun 26', value: 28000 },
  { date: 'Jun 28', value: 88000 },
];

const Y_TICKS_DISPLAY = [0, 20000, 40000, 80000, 160000, 320000];
const Y_TICK_COUNT = Y_TICKS_DISPLAY.length; 

function toLinear(realValue: number): number {
  const maxDisplay = Y_TICKS_DISPLAY[Y_TICK_COUNT - 1]; 
  for (let i = 0; i < Y_TICK_COUNT - 1; i++) {
    const lo = Y_TICKS_DISPLAY[i];
    const hi = Y_TICKS_DISPLAY[i + 1];
    if (realValue <= hi) {
      return i + (realValue - lo) / (hi - lo);
    }
  }
  return Y_TICK_COUNT - 1;
}

/** Format the linearised tick index back to a dollar label */
function formatYAxis(linearTick: number): string {
  const idx = Math.round(linearTick);
  if (idx < 0 || idx >= Y_TICK_COUNT) return '';
  const val = Y_TICKS_DISPLAY[idx];
  if (val === 0) return '0';
  if (val >= 1000) return `$${val / 1000}k`;
  return `$${val}`;
}

/** Pre-process data: add a `linear` field for the chart */
function toChartData(data: RevenueDataPoint[]) {
  return data.map((d) => ({ ...d, linear: toLinear(d.value) }));
}

/** Format tooltip value */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: RevenueDataPoint & { linear: number } }>;
  label?: string;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;
  const realValue = payload[0].payload.value ?? 0;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        style={{
          background: '#2D2D3A',
          color: '#fff',
          fontSize: 12,
          fontWeight: 600,
          padding: '5px 10px',
          borderRadius: 8,
          whiteSpace: 'nowrap',
          letterSpacing: '0.01em',
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          position: 'relative',
        }}
      >
        {formatCurrency(realValue)}
        {/* Downward caret */}
        <span
          style={{
            position: 'absolute',
            bottom: -6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid #2D2D3A',
          }}
        />
      </div>
    </div>
  );
};

const CustomActiveDot = (props: any) => {
  const { cx, cy } = props;
  return (
    <circle cx={cx} cy={cy} r={5} fill='#6B21A8' stroke='white' strokeWidth={2} />
  );
};

const CustomCursor = (props: any) => {
  const { points, height } = props;
  if (!points || points.length === 0) return null;
  const { x, y } = points[0];
  return (
    <line
      x1={x}
      y1={y}
      x2={x}
      y2={y + height}
      stroke='#6B21A8'
      strokeWidth={1}
      strokeDasharray='4 4'
      opacity={0.5}
    />
  );
};

const RevenueTrends = ({ data, onPeriodChange }: RevenueTrendsProps) => {
  const [period, setPeriod] = useState('30');

  const rawData = data ?? defaultData;
  const chartData = toChartData(rawData);
  const isEmpty = chartData.length === 0;

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    onPeriodChange?.(value);
  };

  const linearTicks = Y_TICKS_DISPLAY.map((_, i) => i);

  return (
    <section className='border border-card-border rounded-2xl bg-white flex flex-col overflow-hidden'>
      {/* ── Header ── */}
      <header className='flex items-center justify-between px-5 py-4 border-b border-card-border'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-full border border-[#E3E3E3] bg-[#F5F5F5] flex items-center justify-center text-[#6B21A8]'>
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
              <path d='M12 8v4M10 10h4' />
            </svg>
          </div>
          <h3 className='font-medium text-[#1E1E1E] text-[16px]'>Revenue trends</h3>
        </div>

        <Select value={period} onValueChange={handlePeriodChange}>
          <SelectTrigger className='w-[130px] rounded-full font-medium text-[#1E1E1E] text-xs h-8'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='30'>This Month</SelectItem>
            <SelectItem value='7'>This Week</SelectItem>
            <SelectItem value='365'>This Year</SelectItem>
          </SelectContent>
        </Select>
      </header>

      <div className='flex-1 px-2 pt-4 pb-2' style={{ minHeight: 240 }}>
        {isEmpty ? (
          <div className='flex items-center justify-center h-full text-sm text-[#9B9B9B]'>
            No Data to Show yet...
          </div>
        ) : (
          <ResponsiveContainer width='100%' height={240}>
            <AreaChart
              data={chartData}
              margin={{ top: 24, right: 16, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id='revenueGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#7C3AED' stopOpacity={0.08} />
                  <stop offset='95%' stopColor='#7C3AED' stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray='3 3'
                stroke='#F0F0F0'
                vertical={false}
              />

              <XAxis
                dataKey='date'
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#9B9B9B' }}
                dy={8}
                interval={0}
              />

              <YAxis
                dataKey='linear'
                type='number'
                domain={[0, Y_TICK_COUNT - 1]}  
                ticks={linearTicks}             
                tickFormatter={formatYAxis}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#9B9B9B' }}
                dx={-4}
                width={52}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={<CustomCursor />}
                wrapperStyle={{ zIndex: 10 }}
              />

              <Area
                type='monotone'
                dataKey='linear' 
                stroke='#7C3AED'
                strokeWidth={2.5}
                fill='url(#revenueGradient)'
                dot={false}
                activeDot={<CustomActiveDot />}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
};

export default RevenueTrends;