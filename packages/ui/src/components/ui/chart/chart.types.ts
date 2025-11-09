export type ChartDataPoint = Record<string, string | number>

export type ChartType = 'line' | 'bar' | 'area' | 'pie' | 'composed'

export interface BaseChartProps {
  /** Chart data */
  data: ChartDataPoint[]
  /** Chart width */
  width?: number | string
  /** Chart height */
  height?: number | string
  /** Chart margin */
  margin?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
  /** Additional class name */
  className?: string
}

export interface LineChartProps extends BaseChartProps {
  /** X-axis data key */
  xAxisKey: string
  /** Y-axis data keys and their colors */
  lines: Array<{
    dataKey: string
    stroke?: string
    strokeWidth?: number
    name?: string
  }>
  /** Show grid */
  showGrid?: boolean
  /** Show tooltip */
  showTooltip?: boolean
  /** Show legend */
  showLegend?: boolean
}

export interface BarChartProps extends BaseChartProps {
  /** X-axis data key */
  xAxisKey: string
  /** Bar data keys and their colors */
  bars: Array<{
    dataKey: string
    fill?: string
    name?: string
  }>
  /** Show grid */
  showGrid?: boolean
  /** Show tooltip */
  showTooltip?: boolean
  /** Show legend */
  showLegend?: boolean
  /** Stack bars */
  stacked?: boolean
}

export interface AreaChartProps extends BaseChartProps {
  /** X-axis data key */
  xAxisKey: string
  /** Area data keys and their colors */
  areas: Array<{
    dataKey: string
    fill?: string
    stroke?: string
    name?: string
  }>
  /** Show grid */
  showGrid?: boolean
  /** Show tooltip */
  showTooltip?: boolean
  /** Show legend */
  showLegend?: boolean
  /** Stack areas */
  stacked?: boolean
}

export interface PieChartProps extends Omit<BaseChartProps, 'data'> {
  /** Pie chart data with specific structure */
  data: Array<{
    name: string
    value: number
    fill?: string
  }>
  /** Show labels */
  showLabels?: boolean
  /** Inner radius (for donut chart) */
  innerRadius?: number
  /** Outer radius */
  outerRadius?: number
  /** Show tooltip */
  showTooltip?: boolean
  /** Show legend */
  showLegend?: boolean
}

export interface ComposedChartProps extends BaseChartProps {
  /** X-axis data key */
  xAxisKey: string
  /** Lines configuration */
  lines?: Array<{
    dataKey: string
    stroke?: string
    strokeWidth?: number
    name?: string
  }>
  /** Bars configuration */
  bars?: Array<{
    dataKey: string
    fill?: string
    name?: string
  }>
  /** Areas configuration */
  areas?: Array<{
    dataKey: string
    fill?: string
    stroke?: string
    name?: string
  }>
  /** Show grid */
  showGrid?: boolean
  /** Show tooltip */
  showTooltip?: boolean
  /** Show legend */
  showLegend?: boolean
}
