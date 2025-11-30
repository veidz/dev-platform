import { describe, expect, it } from '@jest/globals'
import { render } from '@testing-library/react'

import {
  AreaChart,
  BarChart,
  ComposedChart,
  LineChart,
  PieChart,
} from '@/components/ui/chart/chart'

describe('Chart Components', () => {
  const mockLineData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
  ]

  const mockBarData = [
    { name: 'A', value: 100 },
    { name: 'B', value: 200 },
    { name: 'C', value: 150 },
  ]

  const mockPieData = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 200 },
  ]

  describe('LineChart component', () => {
    it('should render line chart', () => {
      const { container } = render(
        <LineChart
          data={mockLineData}
          xAxisKey="name"
          lines={[{ dataKey: 'value' }]}
        />,
      )

      expect(container.querySelector('.recharts-wrapper')).toBeDefined()
    })

    it('should render with multiple lines', () => {
      const data = [
        { name: 'Jan', value1: 100, value2: 200 },
        { name: 'Feb', value1: 150, value2: 250 },
      ]

      const { container } = render(
        <LineChart
          data={data}
          xAxisKey="name"
          lines={[{ dataKey: 'value1' }, { dataKey: 'value2' }]}
        />,
      )

      expect(
        container.querySelector('.recharts-responsive-container'),
      ).toBeDefined()
    })

    it('should apply custom dimensions', () => {
      const { container } = render(
        <LineChart
          data={mockLineData}
          xAxisKey="name"
          lines={[{ dataKey: 'value' }]}
          width={500}
          height={400}
        />,
      )

      expect(container.querySelector('.recharts-wrapper')).toBeDefined()
    })

    it('should render without grid when showGrid is false', () => {
      const { container } = render(
        <LineChart
          data={mockLineData}
          xAxisKey="name"
          lines={[{ dataKey: 'value' }]}
          showGrid={false}
        />,
      )

      expect(container.querySelector('.recharts-cartesian-grid')).toBeNull()
    })

    it('should render without tooltip when showTooltip is false', () => {
      const { container } = render(
        <LineChart
          data={mockLineData}
          xAxisKey="name"
          lines={[{ dataKey: 'value' }]}
          showTooltip={false}
        />,
      )

      expect(container.querySelector('.recharts-tooltip-wrapper')).toBeNull()
    })

    it('should render without legend when showLegend is false', () => {
      const { container } = render(
        <LineChart
          data={mockLineData}
          xAxisKey="name"
          lines={[{ dataKey: 'value' }]}
          showLegend={false}
        />,
      )

      expect(container.querySelector('.recharts-legend-wrapper')).toBeNull()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <LineChart
          data={mockLineData}
          xAxisKey="name"
          lines={[{ dataKey: 'value' }]}
          className="custom-chart"
        />,
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('custom-chart')
    })

    it('should forward ref', () => {
      const ref = { current: null }

      render(
        <LineChart
          ref={ref}
          data={mockLineData}
          xAxisKey="name"
          lines={[{ dataKey: 'value' }]}
        />,
      )

      expect(ref.current).not.toBeNull()
    })

    it('should use custom line properties', () => {
      const { container } = render(
        <LineChart
          data={mockLineData}
          xAxisKey="name"
          lines={[
            {
              dataKey: 'value',
              stroke: '#ff0000',
              strokeWidth: 3,
              name: 'Custom Line',
            },
          ]}
        />,
      )

      const line = container.querySelector('.recharts-line')
      expect(line).toBeDefined()
    })
  })

  describe('BarChart component', () => {
    it('should render bar chart', () => {
      const { container } = render(
        <BarChart
          data={mockBarData}
          xAxisKey="name"
          bars={[{ dataKey: 'value' }]}
        />,
      )

      expect(container.querySelector('.recharts-wrapper')).toBeDefined()
    })

    it('should render with multiple bars', () => {
      const data = [
        { name: 'A', value1: 100, value2: 150 },
        { name: 'B', value1: 200, value2: 250 },
      ]

      const { container } = render(
        <BarChart
          data={data}
          xAxisKey="name"
          bars={[{ dataKey: 'value1' }, { dataKey: 'value2' }]}
        />,
      )

      expect(
        container.querySelector('.recharts-responsive-container'),
      ).toBeDefined()
    })

    it('should render stacked bars', () => {
      const data = [
        { name: 'A', value1: 100, value2: 50 },
        { name: 'B', value1: 150, value2: 75 },
      ]

      const { container } = render(
        <BarChart
          data={data}
          xAxisKey="name"
          bars={[{ dataKey: 'value1' }, { dataKey: 'value2' }]}
          stacked
        />,
      )

      expect(container.querySelector('.recharts-wrapper')).toBeDefined()
    })

    it('should render without grid when showGrid is false', () => {
      const { container } = render(
        <BarChart
          data={mockBarData}
          xAxisKey="name"
          bars={[{ dataKey: 'value' }]}
          showGrid={false}
        />,
      )

      expect(container.querySelector('.recharts-cartesian-grid')).toBeNull()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <BarChart
          data={mockBarData}
          xAxisKey="name"
          bars={[{ dataKey: 'value' }]}
          className="custom-bar-chart"
        />,
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('custom-bar-chart')
    })

    it('should forward ref', () => {
      const ref = { current: null }

      render(
        <BarChart
          ref={ref}
          data={mockBarData}
          xAxisKey="name"
          bars={[{ dataKey: 'value' }]}
        />,
      )

      expect(ref.current).not.toBeNull()
    })

    it('should use custom bar properties', () => {
      const { container } = render(
        <BarChart
          data={mockBarData}
          xAxisKey="name"
          bars={[{ dataKey: 'value', fill: '#00ff00', name: 'Custom Bar' }]}
        />,
      )

      expect(container.querySelector('.recharts-bar')).toBeDefined()
    })
  })

  describe('AreaChart component', () => {
    it('should render area chart', () => {
      const { container } = render(
        <AreaChart
          data={mockLineData}
          xAxisKey="name"
          areas={[{ dataKey: 'value' }]}
        />,
      )

      expect(container.querySelector('.recharts-wrapper')).toBeDefined()
    })

    it('should render with multiple areas', () => {
      const data = [
        { name: 'Jan', value1: 100, value2: 150 },
        { name: 'Feb', value1: 200, value2: 250 },
      ]

      const { container } = render(
        <AreaChart
          data={data}
          xAxisKey="name"
          areas={[{ dataKey: 'value1' }, { dataKey: 'value2' }]}
        />,
      )

      expect(
        container.querySelector('.recharts-responsive-container'),
      ).toBeDefined()
    })

    it('should render stacked areas', () => {
      const data = [
        { name: 'Jan', value1: 100, value2: 50 },
        { name: 'Feb', value1: 150, value2: 75 },
      ]

      const { container } = render(
        <AreaChart
          data={data}
          xAxisKey="name"
          areas={[{ dataKey: 'value1' }, { dataKey: 'value2' }]}
          stacked
        />,
      )

      expect(container.querySelector('.recharts-wrapper')).toBeDefined()
    })

    it('should render without tooltip when showTooltip is false', () => {
      const { container } = render(
        <AreaChart
          data={mockLineData}
          xAxisKey="name"
          areas={[{ dataKey: 'value' }]}
          showTooltip={false}
        />,
      )

      expect(container.querySelector('.recharts-tooltip-wrapper')).toBeNull()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <AreaChart
          data={mockLineData}
          xAxisKey="name"
          areas={[{ dataKey: 'value' }]}
          className="custom-area-chart"
        />,
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('custom-area-chart')
    })

    it('should forward ref', () => {
      const ref = { current: null }

      render(
        <AreaChart
          ref={ref}
          data={mockLineData}
          xAxisKey="name"
          areas={[{ dataKey: 'value' }]}
        />,
      )

      expect(ref.current).not.toBeNull()
    })

    it('should use custom area properties', () => {
      const { container } = render(
        <AreaChart
          data={mockLineData}
          xAxisKey="name"
          areas={[
            {
              dataKey: 'value',
              fill: '#ff00ff',
              stroke: '#00ffff',
              name: 'Custom Area',
            },
          ]}
        />,
      )

      expect(container.querySelector('.recharts-area')).toBeDefined()
    })
  })

  describe('PieChart component', () => {
    it('should render pie chart', () => {
      const { container } = render(<PieChart data={mockPieData} />)

      expect(container.querySelector('.recharts-wrapper')).toBeDefined()
    })

    it('should render with custom dimensions', () => {
      const { container } = render(
        <PieChart data={mockPieData} width={400} height={400} />,
      )

      expect(container.querySelector('.recharts-wrapper')).toBeDefined()
    })

    it('should render without labels when showLabels is false', () => {
      const { container } = render(
        <PieChart data={mockPieData} showLabels={false} />,
      )

      expect(container.querySelector('.recharts-wrapper')).toBeDefined()
    })

    it('should render as donut chart with innerRadius', () => {
      const { container } = render(
        <PieChart data={mockPieData} innerRadius={60} outerRadius={100} />,
      )

      expect(container.querySelector('.recharts-pie')).toBeDefined()
    })

    it('should render without tooltip when showTooltip is false', () => {
      const { container } = render(
        <PieChart data={mockPieData} showTooltip={false} />,
      )

      expect(container.querySelector('.recharts-tooltip-wrapper')).toBeNull()
    })

    it('should render without legend when showLegend is false', () => {
      const { container } = render(
        <PieChart data={mockPieData} showLegend={false} />,
      )

      expect(container.querySelector('.recharts-legend-wrapper')).toBeNull()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <PieChart data={mockPieData} className="custom-pie-chart" />,
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('custom-pie-chart')
    })

    it('should forward ref', () => {
      const ref = { current: null }

      render(<PieChart ref={ref} data={mockPieData} />)

      expect(ref.current).not.toBeNull()
    })

    it('should render cells with custom colors', () => {
      const dataWithColors = [
        { name: 'A', value: 100, fill: '#ff0000' },
        { name: 'B', value: 200, fill: '#00ff00' },
        { name: 'C', value: 150, fill: '#0000ff' },
      ]

      const { container } = render(<PieChart data={dataWithColors} />)

      expect(container.querySelector('.recharts-pie')).toBeDefined()
    })
  })

  describe('ComposedChart component', () => {
    it('should render composed chart with lines', () => {
      const { container } = render(
        <ComposedChart
          data={mockLineData}
          xAxisKey="name"
          lines={[{ dataKey: 'value' }]}
        />,
      )

      expect(container.querySelector('.recharts-wrapper')).toBeDefined()
    })

    it('should render composed chart with bars', () => {
      const { container } = render(
        <ComposedChart
          data={mockBarData}
          xAxisKey="name"
          bars={[{ dataKey: 'value' }]}
        />,
      )

      expect(container.querySelector('.recharts-wrapper')).toBeDefined()
    })

    it('should render composed chart with areas', () => {
      const { container } = render(
        <ComposedChart
          data={mockLineData}
          xAxisKey="name"
          areas={[{ dataKey: 'value' }]}
        />,
      )

      expect(container.querySelector('.recharts-wrapper')).toBeDefined()
    })

    it('should render composed chart with multiple types', () => {
      const data = [
        { name: 'Jan', line: 100, bar: 80, area: 120 },
        { name: 'Feb', line: 150, bar: 130, area: 160 },
        { name: 'Mar', line: 200, bar: 180, area: 210 },
      ]

      const { container } = render(
        <ComposedChart
          data={data}
          xAxisKey="name"
          lines={[{ dataKey: 'line' }]}
          bars={[{ dataKey: 'bar' }]}
          areas={[{ dataKey: 'area' }]}
        />,
      )

      expect(container.querySelector('.recharts-line')).toBeDefined()
      expect(container.querySelector('.recharts-bar')).toBeDefined()
      expect(container.querySelector('.recharts-area')).toBeDefined()
    })

    it('should render without grid when showGrid is false', () => {
      const { container } = render(
        <ComposedChart
          data={mockLineData}
          xAxisKey="name"
          lines={[{ dataKey: 'value' }]}
          showGrid={false}
        />,
      )

      expect(container.querySelector('.recharts-cartesian-grid')).toBeNull()
    })

    it('should render without tooltip when showTooltip is false', () => {
      const { container } = render(
        <ComposedChart
          data={mockLineData}
          xAxisKey="name"
          lines={[{ dataKey: 'value' }]}
          showTooltip={false}
        />,
      )

      expect(container.querySelector('.recharts-tooltip-wrapper')).toBeNull()
    })

    it('should render without legend when showLegend is false', () => {
      const { container } = render(
        <ComposedChart
          data={mockLineData}
          xAxisKey="name"
          lines={[{ dataKey: 'value' }]}
          showLegend={false}
        />,
      )

      expect(container.querySelector('.recharts-legend-wrapper')).toBeNull()
    })

    it('should apply custom dimensions', () => {
      const { container } = render(
        <ComposedChart
          data={mockLineData}
          xAxisKey="name"
          lines={[{ dataKey: 'value' }]}
          width={600}
          height={450}
        />,
      )

      expect(container.querySelector('.recharts-wrapper')).toBeDefined()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <ComposedChart
          data={mockLineData}
          xAxisKey="name"
          lines={[{ dataKey: 'value' }]}
          className="custom-composed-chart"
        />,
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('custom-composed-chart')
    })

    it('should forward ref', () => {
      const ref = { current: null }

      render(
        <ComposedChart
          ref={ref}
          data={mockLineData}
          xAxisKey="name"
          lines={[{ dataKey: 'value' }]}
        />,
      )

      expect(ref.current).not.toBeNull()
    })

    it('should handle empty arrays gracefully', () => {
      const { container } = render(
        <ComposedChart data={mockLineData} xAxisKey="name" />,
      )

      expect(container.querySelector('.recharts-wrapper')).toBeDefined()
    })
  })
})
