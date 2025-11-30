import { describe, expect, it } from '@jest/globals'
import { render } from '@testing-library/react'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

describe('Table', () => {
  describe('Table component', () => {
    it('should render correctly', () => {
      const { container } = render(
        <Table>
          <tbody>
            <tr>
              <td>Cell</td>
            </tr>
          </tbody>
        </Table>,
      )
      const wrapper = container.querySelector('div')
      expect(wrapper).toBeDefined()
      expect(wrapper?.className).toContain('overflow-auto')
    })

    it('should apply wrapper classes', () => {
      const { container } = render(
        <Table>
          <tbody>
            <tr>
              <td>Cell</td>
            </tr>
          </tbody>
        </Table>,
      )
      const wrapper = container.querySelector('div')
      expect(wrapper?.className).toContain('relative')
      expect(wrapper?.className).toContain('w-full')
      expect(wrapper?.className).toContain('overflow-auto')
    })

    it('should apply table default classes', () => {
      const { container } = render(
        <Table>
          <tbody>
            <tr>
              <td>Cell</td>
            </tr>
          </tbody>
        </Table>,
      )
      const table = container.querySelector('table')
      expect(table?.className).toContain('w-full')
      expect(table?.className).toContain('caption-bottom')
      expect(table?.className).toContain('text-sm')
    })

    it('should merge custom className', () => {
      const { container } = render(
        <Table className="custom-table">
          <tbody>
            <tr>
              <td>Cell</td>
            </tr>
          </tbody>
        </Table>,
      )
      const table = container.querySelector('table')
      expect(table?.className).toContain('custom-table')
      expect(table?.className).toContain('w-full')
    })

    it('should forward ref', () => {
      const ref = { current: null }
      render(
        <Table ref={ref}>
          <tbody>
            <tr>
              <td>Cell</td>
            </tr>
          </tbody>
        </Table>,
      )
      expect(ref.current).toBeDefined()
    })
  })

  describe('TableHeader component', () => {
    it('should render correctly', () => {
      const { container } = render(
        <table>
          <TableHeader>
            <tr>
              <th>Header</th>
            </tr>
          </TableHeader>
        </table>,
      )
      const thead = container.querySelector('thead')
      expect(thead).toBeDefined()
      expect(thead?.textContent).toBe('Header')
    })

    it('should apply default classes', () => {
      const { container } = render(
        <table>
          <TableHeader>
            <tr>
              <th>Header</th>
            </tr>
          </TableHeader>
        </table>,
      )
      const thead = container.querySelector('thead')
      expect(thead?.className).toContain('[&_tr]:border-b')
    })

    it('should merge custom className', () => {
      const { container } = render(
        <table>
          <TableHeader className="custom-header">
            <tr>
              <th>Header</th>
            </tr>
          </TableHeader>
        </table>,
      )
      const thead = container.querySelector('thead')
      expect(thead?.className).toContain('custom-header')
    })

    it('should forward ref', () => {
      const ref = { current: null }
      render(
        <table>
          <TableHeader ref={ref}>
            <tr>
              <th>Header</th>
            </tr>
          </TableHeader>
        </table>,
      )
      expect(ref.current).toBeDefined()
    })
  })

  describe('TableBody component', () => {
    it('should render correctly', () => {
      const { container } = render(
        <table>
          <TableBody>
            <tr>
              <td>Body</td>
            </tr>
          </TableBody>
        </table>,
      )
      const tbody = container.querySelector('tbody')
      expect(tbody).toBeDefined()
      expect(tbody?.textContent).toBe('Body')
    })

    it('should apply default classes', () => {
      const { container } = render(
        <table>
          <TableBody>
            <tr>
              <td>Body</td>
            </tr>
          </TableBody>
        </table>,
      )
      const tbody = container.querySelector('tbody')
      expect(tbody?.className).toContain('[&_tr:last-child]:border-0')
    })

    it('should merge custom className', () => {
      const { container } = render(
        <table>
          <TableBody className="custom-body">
            <tr>
              <td>Body</td>
            </tr>
          </TableBody>
        </table>,
      )
      const tbody = container.querySelector('tbody')
      expect(tbody?.className).toContain('custom-body')
    })

    it('should forward ref', () => {
      const ref = { current: null }
      render(
        <table>
          <TableBody ref={ref}>
            <tr>
              <td>Body</td>
            </tr>
          </TableBody>
        </table>,
      )
      expect(ref.current).toBeDefined()
    })
  })

  describe('TableFooter component', () => {
    it('should render correctly', () => {
      const { container } = render(
        <table>
          <TableFooter>
            <tr>
              <td>Footer</td>
            </tr>
          </TableFooter>
        </table>,
      )
      const tfoot = container.querySelector('tfoot')
      expect(tfoot).toBeDefined()
      expect(tfoot?.textContent).toBe('Footer')
    })

    it('should apply default classes', () => {
      const { container } = render(
        <table>
          <TableFooter>
            <tr>
              <td>Footer</td>
            </tr>
          </TableFooter>
        </table>,
      )
      const tfoot = container.querySelector('tfoot')
      expect(tfoot?.className).toContain('border-t')
      expect(tfoot?.className).toContain('bg-muted/50')
      expect(tfoot?.className).toContain('font-medium')
    })

    it('should merge custom className', () => {
      const { container } = render(
        <table>
          <TableFooter className="custom-footer">
            <tr>
              <td>Footer</td>
            </tr>
          </TableFooter>
        </table>,
      )
      const tfoot = container.querySelector('tfoot')
      expect(tfoot?.className).toContain('custom-footer')
    })

    it('should forward ref', () => {
      const ref = { current: null }
      render(
        <table>
          <TableFooter ref={ref}>
            <tr>
              <td>Footer</td>
            </tr>
          </TableFooter>
        </table>,
      )
      expect(ref.current).toBeDefined()
    })
  })

  describe('TableRow component', () => {
    it('should render correctly', () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow>
              <td>Cell</td>
            </TableRow>
          </tbody>
        </table>,
      )
      const tr = container.querySelector('tr')
      expect(tr).toBeDefined()
      expect(tr?.textContent).toBe('Cell')
    })

    it('should apply default classes', () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow>
              <td>Cell</td>
            </TableRow>
          </tbody>
        </table>,
      )
      const tr = container.querySelector('tr')
      expect(tr?.className).toContain('border-b')
      expect(tr?.className).toContain('transition-colors')
      expect(tr?.className).toContain('hover:bg-muted/50')
    })

    it('should merge custom className', () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow className="custom-row">
              <td>Cell</td>
            </TableRow>
          </tbody>
        </table>,
      )
      const tr = container.querySelector('tr')
      expect(tr?.className).toContain('custom-row')
    })

    it('should forward ref', () => {
      const ref = { current: null }
      render(
        <table>
          <tbody>
            <TableRow ref={ref}>
              <td>Cell</td>
            </TableRow>
          </tbody>
        </table>,
      )
      expect(ref.current).toBeDefined()
    })

    it('should handle data-state attribute', () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow data-state="selected">
              <td>Cell</td>
            </TableRow>
          </tbody>
        </table>,
      )
      const tr = container.querySelector('tr')
      expect(tr?.getAttribute('data-state')).toBe('selected')
    })
  })

  describe('TableHead component', () => {
    it('should render correctly', () => {
      const { container } = render(
        <table>
          <thead>
            <tr>
              <TableHead>Header Cell</TableHead>
            </tr>
          </thead>
        </table>,
      )
      const th = container.querySelector('th')
      expect(th).toBeDefined()
      expect(th?.textContent).toBe('Header Cell')
    })

    it('should apply default classes', () => {
      const { container } = render(
        <table>
          <thead>
            <tr>
              <TableHead>Header</TableHead>
            </tr>
          </thead>
        </table>,
      )
      const th = container.querySelector('th')
      expect(th?.className).toContain('h-10')
      expect(th?.className).toContain('px-2')
      expect(th?.className).toContain('text-left')
      expect(th?.className).toContain('font-medium')
    })

    it('should merge custom className', () => {
      const { container } = render(
        <table>
          <thead>
            <tr>
              <TableHead className="text-center">Header</TableHead>
            </tr>
          </thead>
        </table>,
      )
      const th = container.querySelector('th')
      expect(th?.className).toContain('text-center')
    })

    it('should forward ref', () => {
      const ref = { current: null }
      render(
        <table>
          <thead>
            <tr>
              <TableHead ref={ref}>Header</TableHead>
            </tr>
          </thead>
        </table>,
      )
      expect(ref.current).toBeDefined()
    })

    it('should pass through th attributes', () => {
      const { container } = render(
        <table>
          <thead>
            <tr>
              <TableHead colSpan={2} scope="col">
                Header
              </TableHead>
            </tr>
          </thead>
        </table>,
      )
      const th = container.querySelector('th')
      expect(th?.getAttribute('colspan')).toBe('2')
      expect(th?.getAttribute('scope')).toBe('col')
    })
  })

  describe('TableCell component', () => {
    it('should render correctly', () => {
      const { container } = render(
        <table>
          <tbody>
            <tr>
              <TableCell>Cell Content</TableCell>
            </tr>
          </tbody>
        </table>,
      )
      const td = container.querySelector('td')
      expect(td).toBeDefined()
      expect(td?.textContent).toBe('Cell Content')
    })

    it('should apply default classes', () => {
      const { container } = render(
        <table>
          <tbody>
            <tr>
              <TableCell>Cell</TableCell>
            </tr>
          </tbody>
        </table>,
      )
      const td = container.querySelector('td')
      expect(td?.className).toContain('p-2')
      expect(td?.className).toContain('align-middle')
    })

    it('should merge custom className', () => {
      const { container } = render(
        <table>
          <tbody>
            <tr>
              <TableCell className="text-right">Cell</TableCell>
            </tr>
          </tbody>
        </table>,
      )
      const td = container.querySelector('td')
      expect(td?.className).toContain('text-right')
    })

    it('should forward ref', () => {
      const ref = { current: null }
      render(
        <table>
          <tbody>
            <tr>
              <TableCell ref={ref}>Cell</TableCell>
            </tr>
          </tbody>
        </table>,
      )
      expect(ref.current).toBeDefined()
    })

    it('should pass through td attributes', () => {
      const { container } = render(
        <table>
          <tbody>
            <tr>
              <TableCell colSpan={3} rowSpan={2}>
                Cell
              </TableCell>
            </tr>
          </tbody>
        </table>,
      )
      const td = container.querySelector('td')
      expect(td?.getAttribute('colspan')).toBe('3')
      expect(td?.getAttribute('rowspan')).toBe('2')
    })
  })

  describe('TableCaption component', () => {
    it('should render correctly', () => {
      const { container } = render(
        <table>
          <TableCaption>Table Caption</TableCaption>
        </table>,
      )
      const caption = container.querySelector('caption')
      expect(caption).toBeDefined()
      expect(caption?.textContent).toBe('Table Caption')
    })

    it('should apply default classes', () => {
      const { container } = render(
        <table>
          <TableCaption>Caption</TableCaption>
        </table>,
      )
      const caption = container.querySelector('caption')
      expect(caption?.className).toContain('mt-4')
      expect(caption?.className).toContain('text-sm')
      expect(caption?.className).toContain('text-muted-foreground')
    })

    it('should merge custom className', () => {
      const { container } = render(
        <table>
          <TableCaption className="text-lg">Caption</TableCaption>
        </table>,
      )
      const caption = container.querySelector('caption')
      expect(caption?.className).toContain('text-lg')
    })

    it('should forward ref', () => {
      const ref = { current: null }
      render(
        <table>
          <TableCaption ref={ref}>Caption</TableCaption>
        </table>,
      )
      expect(ref.current).toBeDefined()
    })
  })

  describe('Table composition', () => {
    it('should render complete table with all components', () => {
      const { container } = render(
        <Table>
          <TableCaption>User List</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>john@example.com</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jane Smith</TableCell>
              <TableCell>jane@example.com</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>2 users total</TableCell>
            </TableRow>
          </TableFooter>
        </Table>,
      )

      const table = container.querySelector('table')
      expect(table?.textContent).toContain('User List')
      expect(table?.textContent).toContain('Name')
      expect(table?.textContent).toContain('Email')
      expect(table?.textContent).toContain('John Doe')
      expect(table?.textContent).toContain('Jane Smith')
      expect(table?.textContent).toContain('2 users total')
    })

    it('should work with minimal composition', () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Simple Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      )

      const table = container.querySelector('table')
      expect(table?.textContent).toBe('Simple Cell')
    })
  })
})
