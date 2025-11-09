import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  AreaChart,
  BarChart,
  ComposedChart,
  LineChart,
  PieChart,
} from './chart'

const meta = {
  title: 'UI/Charts',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta

// Sample data for line/bar/area charts
const monthlyData = [
  { month: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
  { month: 'Feb', revenue: 3000, expenses: 1398, profit: 1602 },
  { month: 'Mar', revenue: 2000, expenses: 9800, profit: -7800 },
  { month: 'Apr', revenue: 2780, expenses: 3908, profit: -1128 },
  { month: 'May', revenue: 1890, expenses: 4800, profit: -2910 },
  { month: 'Jun', revenue: 2390, expenses: 3800, profit: -1410 },
  { month: 'Jul', revenue: 3490, expenses: 4300, profit: -810 },
  { month: 'Aug', revenue: 4000, expenses: 2400, profit: 1600 },
  { month: 'Sep', revenue: 3000, expenses: 1398, profit: 1602 },
  { month: 'Oct', revenue: 2000, expenses: 9800, profit: -7800 },
  { month: 'Nov', revenue: 2780, expenses: 3908, profit: -1128 },
  { month: 'Dec', revenue: 1890, expenses: 4800, profit: -2910 },
]

const salesData = [
  { day: 'Mon', sales: 120, orders: 45 },
  { day: 'Tue', sales: 190, orders: 68 },
  { day: 'Wed', sales: 280, orders: 95 },
  { day: 'Thu', sales: 250, orders: 82 },
  { day: 'Fri', sales: 350, orders: 110 },
  { day: 'Sat', sales: 420, orders: 135 },
  { day: 'Sun', sales: 380, orders: 125 },
]

const trafficData = [
  { hour: '00:00', visitors: 120 },
  { hour: '03:00', visitors: 80 },
  { hour: '06:00', visitors: 150 },
  { hour: '09:00', visitors: 320 },
  { hour: '12:00', visitors: 450 },
  { hour: '15:00', visitors: 380 },
  { hour: '18:00', visitors: 520 },
  { hour: '21:00', visitors: 290 },
]

// Sample data for pie chart
const categoryData = [
  { name: 'Electronics', value: 4500, fill: '#8884d8' },
  { name: 'Clothing', value: 3200, fill: '#82ca9d' },
  { name: 'Food', value: 2800, fill: '#ffc658' },
  { name: 'Books', value: 1500, fill: '#ff7c7c' },
  { name: 'Other', value: 1000, fill: '#8dd1e1' },
]

const statusData = [
  { name: 'Active', value: 65 },
  { name: 'Pending', value: 20 },
  { name: 'Inactive', value: 15 },
]

type LineStory = StoryObj<typeof LineChart>
type BarStory = StoryObj<typeof BarChart>
type AreaStory = StoryObj<typeof AreaChart>
type PieStory = StoryObj<typeof PieChart>
type ComposedStory = StoryObj<typeof ComposedChart>

export const SimpleLineChart: LineStory = {
  render: () => (
    <LineChart
      data={salesData}
      xAxisKey="day"
      lines={[{ dataKey: 'sales', stroke: '#8884d8', name: 'Sales' }]}
      height={300}
    />
  ),
}

export const MultiLineChart: LineStory = {
  render: () => (
    <LineChart
      data={salesData}
      xAxisKey="day"
      lines={[
        { dataKey: 'sales', stroke: '#8884d8', name: 'Sales' },
        { dataKey: 'orders', stroke: '#82ca9d', name: 'Orders' },
      ]}
      height={350}
    />
  ),
}

export const SimpleBarChart: BarStory = {
  render: () => (
    <BarChart
      data={salesData}
      xAxisKey="day"
      bars={[{ dataKey: 'sales', fill: '#8884d8', name: 'Sales' }]}
      height={300}
    />
  ),
}

export const MultiBarChart: BarStory = {
  render: () => (
    <BarChart
      data={salesData}
      xAxisKey="day"
      bars={[
        { dataKey: 'sales', fill: '#8884d8', name: 'Sales' },
        { dataKey: 'orders', fill: '#82ca9d', name: 'Orders' },
      ]}
      height={350}
    />
  ),
}

export const StackedBarChart: BarStory = {
  render: () => (
    <BarChart
      data={monthlyData}
      xAxisKey="month"
      bars={[
        { dataKey: 'revenue', fill: '#82ca9d', name: 'Revenue' },
        { dataKey: 'expenses', fill: '#ff7c7c', name: 'Expenses' },
      ]}
      stacked
      height={350}
    />
  ),
}

export const SimpleAreaChart: AreaStory = {
  render: () => (
    <AreaChart
      data={trafficData}
      xAxisKey="hour"
      areas={[
        {
          dataKey: 'visitors',
          fill: '#8884d8',
          stroke: '#8884d8',
          name: 'Visitors',
        },
      ]}
      height={300}
    />
  ),
}

export const StackedAreaChart: AreaStory = {
  render: () => (
    <AreaChart
      data={monthlyData}
      xAxisKey="month"
      areas={[
        {
          dataKey: 'revenue',
          fill: '#82ca9d',
          stroke: '#82ca9d',
          name: 'Revenue',
        },
        {
          dataKey: 'expenses',
          fill: '#ff7c7c',
          stroke: '#ff7c7c',
          name: 'Expenses',
        },
      ]}
      stacked
      height={350}
    />
  ),
}

export const SimplePieChart: PieStory = {
  render: () => <PieChart data={categoryData} height={400} />,
}

export const DonutChart: PieStory = {
  render: () => (
    <PieChart
      data={statusData}
      height={400}
      innerRadius={60}
      outerRadius={100}
    />
  ),
}

export const PieChartNoLabels: PieStory = {
  render: () => (
    <PieChart data={categoryData} height={400} showLabels={false} />
  ),
}

export const MixedComposedChart: ComposedStory = {
  render: () => (
    <ComposedChart
      data={monthlyData}
      xAxisKey="month"
      bars={[{ dataKey: 'revenue', fill: '#82ca9d', name: 'Revenue' }]}
      lines={[
        {
          dataKey: 'profit',
          stroke: '#8884d8',
          strokeWidth: 2,
          name: 'Profit',
        },
      ]}
      height={400}
    />
  ),
}

export const FullComposedChart: ComposedStory = {
  render: () => (
    <ComposedChart
      data={monthlyData}
      xAxisKey="month"
      areas={[
        {
          dataKey: 'expenses',
          fill: '#ff7c7c',
          stroke: '#ff7c7c',
          name: 'Expenses',
        },
      ]}
      bars={[{ dataKey: 'revenue', fill: '#82ca9d', name: 'Revenue' }]}
      lines={[
        {
          dataKey: 'profit',
          stroke: '#8884d8',
          strokeWidth: 3,
          name: 'Profit',
        },
      ]}
      height={450}
    />
  ),
}

export const RevenueLineChart: LineStory = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-lg font-semibold">Revenue Overview</h3>
        <p className="text-sm text-muted-foreground">
          Monthly revenue trend for 2024
        </p>
      </div>
      <LineChart
        data={monthlyData}
        xAxisKey="month"
        lines={[
          {
            dataKey: 'revenue',
            stroke: '#82ca9d',
            strokeWidth: 3,
            name: 'Revenue ($)',
          },
        ]}
        height={350}
      />
    </div>
  ),
}

export const WeeklySalesBar: BarStory = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-lg font-semibold">Weekly Sales</h3>
        <p className="text-sm text-muted-foreground">
          Daily sales and order count
        </p>
      </div>
      <BarChart
        data={salesData}
        xAxisKey="day"
        bars={[
          { dataKey: 'sales', fill: '#8884d8', name: 'Sales ($)' },
          { dataKey: 'orders', fill: '#ffc658', name: 'Orders' },
        ]}
        height={350}
      />
    </div>
  ),
}
