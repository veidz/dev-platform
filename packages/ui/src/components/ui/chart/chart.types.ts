export type ChartDataPoint = Record<string, string | number>

export type ChartType = 'line' | 'bar' | 'area' | 'pie' | 'composed'

export interface BaseChartProps {
  data: ChartDataPoint[]
  width?: number | string
  height?: number | string
  margin?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
  className?: string
}

export interface LineChartProps extends BaseChartProps {
  xAxisKey: string
  lines: Array<{
    dataKey: string
    stroke?: string
    strokeWidth?: number
    name?: string
  }>
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
}

export interface BarChartProps extends BaseChartProps {
  xAxisKey: string
  bars: Array<{
    dataKey: string
    fill?: string
    name?: string
  }>
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  stacked?: boolean
}

export interface AreaChartProps extends BaseChartProps {
  xAxisKey: string
  areas: Array<{
    dataKey: string
    fill?: string
    stroke?: string
    name?: string
  }>
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  stacked?: boolean
}

export interface PieChartProps extends Omit<BaseChartProps, 'data'> {
  data: Array<{
    name: string
    value: number
    fill?: string
  }>
  showLabels?: boolean
  innerRadius?: number
  outerRadius?: number
  showTooltip?: boolean
  showLegend?: boolean
}

export interface ComposedChartProps extends BaseChartProps {
  xAxisKey: string
  lines?: Array<{
    dataKey: string
    stroke?: string
    strokeWidth?: number
    name?: string
  }>
  bars?: Array<{
    dataKey: string
    fill?: string
    name?: string
  }>
  areas?: Array<{
    dataKey: string
    fill?: string
    stroke?: string
    name?: string
  }>
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
}
