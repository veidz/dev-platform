import * as React from 'react'
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  AreaChart as RechartsAreaChart,
  BarChart as RechartsBarChart,
  ComposedChart as RechartsComposedChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { cn } from '@/lib/utils'

import type {
  AreaChartProps,
  BarChartProps,
  ComposedChartProps,
  LineChartProps,
  PieChartProps,
} from './chart.types'

const DEFAULT_COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7c7c',
  '#8dd1e1',
  '#d084d0',
]

export const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
  (
    {
      data,
      xAxisKey,
      lines,
      width = '100%',
      height = 300,
      margin = { top: 5, right: 30, left: 20, bottom: 5 },
      showGrid = true,
      showTooltip = true,
      showLegend = true,
      className,
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn('w-full', className)}>
        <ResponsiveContainer width={width as number} height={height as number}>
          <RechartsLineChart data={data} margin={margin}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
            {lines.map((line, index) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={
                  line.stroke || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                }
                strokeWidth={line.strokeWidth || 2}
                name={line.name || line.dataKey}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    )
  },
)

LineChart.displayName = 'LineChart'

export const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      data,
      xAxisKey,
      bars,
      width = '100%',
      height = 300,
      margin = { top: 5, right: 30, left: 20, bottom: 5 },
      showGrid = true,
      showTooltip = true,
      showLegend = true,
      stacked = false,
      className,
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn('w-full', className)}>
        <ResponsiveContainer width={width as number} height={height as number}>
          <RechartsBarChart data={data} margin={margin}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
            {bars.map((bar, index) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                fill={bar.fill || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                name={bar.name || bar.dataKey}
                stackId={stacked ? 'stack' : undefined}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    )
  },
)

BarChart.displayName = 'BarChart'

export const AreaChart = React.forwardRef<HTMLDivElement, AreaChartProps>(
  (
    {
      data,
      xAxisKey,
      areas,
      width = '100%',
      height = 300,
      margin = { top: 5, right: 30, left: 20, bottom: 5 },
      showGrid = true,
      showTooltip = true,
      showLegend = true,
      stacked = false,
      className,
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn('w-full', className)}>
        <ResponsiveContainer width={width as number} height={height as number}>
          <RechartsAreaChart data={data} margin={margin}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
            {areas.map((area, index) => (
              <Area
                key={area.dataKey}
                type="monotone"
                dataKey={area.dataKey}
                fill={
                  area.fill || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                }
                stroke={
                  area.stroke || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                }
                name={area.name || area.dataKey}
                stackId={stacked ? 'stack' : undefined}
              />
            ))}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    )
  },
)

AreaChart.displayName = 'AreaChart'

export const PieChart = React.forwardRef<HTMLDivElement, PieChartProps>(
  (
    {
      data,
      width = '100%',
      height = 300,
      showLabels = true,
      innerRadius = 0,
      outerRadius = 80,
      showTooltip = true,
      showLegend = true,
      className,
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn('w-full', className)}>
        <ResponsiveContainer width={width as number} height={height as number}>
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={showLabels}
              label={showLabels}
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.fill || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                  }
                />
              ))}
            </Pie>
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    )
  },
)

PieChart.displayName = 'PieChart'

export const ComposedChart = React.forwardRef<
  HTMLDivElement,
  ComposedChartProps
>(
  (
    {
      data,
      xAxisKey,
      lines = [],
      bars = [],
      areas = [],
      width = '100%',
      height = 300,
      margin = { top: 5, right: 30, left: 20, bottom: 5 },
      showGrid = true,
      showTooltip = true,
      showLegend = true,
      className,
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn('w-full', className)}>
        <ResponsiveContainer width={width as number} height={height as number}>
          <RechartsComposedChart data={data} margin={margin}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
            {areas.map((area, index) => (
              <Area
                key={area.dataKey}
                type="monotone"
                dataKey={area.dataKey}
                fill={
                  area.fill || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                }
                stroke={
                  area.stroke || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                }
                name={area.name || area.dataKey}
              />
            ))}
            {bars.map((bar, index) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                fill={bar.fill || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                name={bar.name || bar.dataKey}
              />
            ))}
            {lines.map((line, index) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={
                  line.stroke || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                }
                strokeWidth={line.strokeWidth || 2}
                name={line.name || line.dataKey}
              />
            ))}
          </RechartsComposedChart>
        </ResponsiveContainer>
      </div>
    )
  },
)

ComposedChart.displayName = 'ComposedChart'
