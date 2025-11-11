import type { ColumnDef } from '@tanstack/react-table'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { DataTable } from '@/components/ui/data-table'

interface TestPerson {
  id: number
  name: string
  email: string
  age: number
  status: 'active' | 'inactive'
}

const mockData: TestPerson[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    status: 'active',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 25,
    status: 'active',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    age: 35,
    status: 'inactive',
  },
  {
    id: 4,
    name: 'Alice Williams',
    email: 'alice@example.com',
    age: 28,
    status: 'active',
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    age: 32,
    status: 'inactive',
  },
]

const basicColumns: ColumnDef<TestPerson>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
]

const sortableColumns: ColumnDef<TestPerson>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
  },
  {
    accessorKey: 'age',
    header: 'Age',
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: false,
  },
]

describe('DataTable Component', () => {
  describe('Basic Rendering', () => {
    it('should render table with data', () => {
      render(<DataTable columns={basicColumns} data={mockData} />)

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
      expect(screen.getByText('35')).toBeInTheDocument()
    })

    it('should render all column headers', () => {
      render(<DataTable columns={basicColumns} data={mockData} />)

      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Age')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
    })

    it('should render all rows', () => {
      render(<DataTable columns={basicColumns} data={mockData} />)

      const rows = screen.getAllByRole('row')

      expect(rows).toHaveLength(mockData.length + 1)
    })

    it('should render empty state when no data', () => {
      render(<DataTable columns={basicColumns} data={[]} />)

      expect(screen.getByText('No results.')).toBeInTheDocument()
    })

    it('should render custom empty message', () => {
      render(
        <DataTable
          columns={basicColumns}
          data={[]}
          emptyMessage="No users found."
        />,
      )

      expect(screen.getByText('No users found.')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <DataTable
          columns={basicColumns}
          data={mockData}
          className="custom-table"
        />,
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('custom-table')
      expect(wrapper).toHaveClass('w-full')
      expect(wrapper).toHaveClass('space-y-4')
    })
  })

  describe('Sorting', () => {
    it('should show sort icons when enableSorting is true', () => {
      render(
        <DataTable
          columns={sortableColumns}
          data={mockData}
          enableSorting={true}
        />,
      )

      const sortIcons = screen.getAllByRole('button')
      expect(sortIcons.length).toBeGreaterThan(0)
    })

    it('should sort by name ascending', async () => {
      const user = userEvent.setup()

      render(
        <DataTable
          columns={sortableColumns}
          data={mockData}
          enableSorting={true}
        />,
      )

      const nameHeader = screen.getByText('Name')
      await user.click(nameHeader)

      const rows = screen.getAllByRole('row')
      const firstDataRow = rows[1]
      expect(
        within(firstDataRow).getByText('Alice Williams'),
      ).toBeInTheDocument()
    })

    it('should sort by name descending on second click', async () => {
      const user = userEvent.setup()

      render(
        <DataTable
          columns={sortableColumns}
          data={mockData}
          enableSorting={true}
        />,
      )

      const nameHeader = screen.getByText('Name')
      await user.click(nameHeader)
      await user.click(nameHeader)

      const rows = screen.getAllByRole('row')
      const firstDataRow = rows[1]
      expect(within(firstDataRow).getByText('John Doe')).toBeInTheDocument()
    })

    it('should sort by age', async () => {
      const user = userEvent.setup()

      render(
        <DataTable
          columns={sortableColumns}
          data={mockData}
          enableSorting={true}
        />,
      )

      const ageHeader = screen.getByText('Age')
      await user.click(ageHeader)

      const rows = screen.getAllByRole('row')
      expect(rows.length).toBeGreaterThan(1)
    })

    it('should not sort columns with enableSorting false', async () => {
      const user = userEvent.setup()

      render(
        <DataTable
          columns={sortableColumns}
          data={mockData}
          enableSorting={true}
        />,
      )

      const statusHeader = screen.getByText('Status')
      await user.click(statusHeader)

      const rows = screen.getAllByRole('row')
      const firstDataRow = rows[1]
      expect(within(firstDataRow).getByText('John Doe')).toBeInTheDocument()
    })

    it('should not show sort icons when enableSorting is false', () => {
      render(
        <DataTable
          columns={sortableColumns}
          data={mockData}
          enableSorting={false}
        />,
      )

      expect(screen.queryByTestId('chevron-up')).not.toBeInTheDocument()
    })
  })

  describe('Pagination', () => {
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `Person ${i + 1}`,
      email: `person${i + 1}@example.com`,
      age: 20 + i,
      status: i % 2 === 0 ? ('active' as const) : ('inactive' as const),
    }))

    it('should render pagination controls', () => {
      render(
        <DataTable
          columns={basicColumns}
          data={largeData}
          enablePagination={true}
        />,
      )

      expect(screen.getByText('Previous')).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()
      expect(screen.getByText('Rows per page')).toBeInTheDocument()
    })

    it('should show first page by default', () => {
      render(
        <DataTable
          columns={basicColumns}
          data={largeData}
          enablePagination={true}
          defaultPageSize={10}
        />,
      )

      expect(screen.getByText(/Page 1 of/)).toBeInTheDocument()
      expect(screen.getByText('Person 1')).toBeInTheDocument()
    })

    it('should navigate to next page', async () => {
      const user = userEvent.setup()

      render(
        <DataTable
          columns={basicColumns}
          data={largeData}
          enablePagination={true}
          defaultPageSize={10}
        />,
      )

      const nextButton = screen.getByText('Next')
      await user.click(nextButton)

      expect(screen.getByText(/Page 2 of/)).toBeInTheDocument()
      expect(screen.getByText('Person 11')).toBeInTheDocument()
    })

    it('should navigate to previous page', async () => {
      const user = userEvent.setup()

      render(
        <DataTable
          columns={basicColumns}
          data={largeData}
          enablePagination={true}
          defaultPageSize={10}
        />,
      )

      const nextButton = screen.getByText('Next')
      await user.click(nextButton)

      const prevButton = screen.getByText('Previous')
      await user.click(prevButton)

      expect(screen.getByText(/Page 1 of/)).toBeInTheDocument()
      expect(screen.getByText('Person 1')).toBeInTheDocument()
    })

    it('should disable previous button on first page', () => {
      render(
        <DataTable
          columns={basicColumns}
          data={largeData}
          enablePagination={true}
        />,
      )

      const prevButton = screen.getByText('Previous')
      expect(prevButton).toBeDisabled()
    })

    it('should disable next button on last page', () => {
      render(
        <DataTable
          columns={basicColumns}
          data={mockData}
          enablePagination={true}
          defaultPageSize={10}
        />,
      )

      const nextButton = screen.getByText('Next')
      expect(nextButton).toBeDisabled()
    })

    it('should change page size', async () => {
      const user = userEvent.setup()

      render(
        <DataTable
          columns={basicColumns}
          data={largeData}
          enablePagination={true}
          defaultPageSize={10}
          pageSizeOptions={[10, 20, 30]}
        />,
      )

      const select = screen.getByDisplayValue('10')
      await user.selectOptions(select, '20')

      expect(screen.getByText('Person 15')).toBeInTheDocument()
    })

    it('should use custom defaultPageSize', () => {
      render(
        <DataTable
          columns={basicColumns}
          data={largeData}
          enablePagination={true}
          defaultPageSize={20}
        />,
      )

      const select = screen.getByDisplayValue('20')
      expect(select).toBeInTheDocument()
    })

    it('should not render pagination when enablePagination is false', () => {
      render(
        <DataTable
          columns={basicColumns}
          data={largeData}
          enablePagination={false}
        />,
      )

      expect(screen.queryByText('Previous')).not.toBeInTheDocument()
      expect(screen.queryByText('Next')).not.toBeInTheDocument()
    })

    it('should show all data when pagination disabled', () => {
      render(
        <DataTable
          columns={basicColumns}
          data={largeData}
          enablePagination={false}
        />,
      )

      expect(screen.getByText('Person 1')).toBeInTheDocument()
      expect(screen.getByText('Person 25')).toBeInTheDocument()
    })
  })

  describe('Row Selection', () => {
    const selectableColumns: ColumnDef<TestPerson>[] = [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      ...basicColumns,
    ]

    it('should call onRowSelectionChange when rows selected', async () => {
      const user = userEvent.setup()
      const handleSelectionChange = jest.fn()

      render(
        <DataTable
          columns={selectableColumns}
          data={mockData}
          enableRowSelection={true}
          onRowSelectionChange={handleSelectionChange}
        />,
      )

      const checkboxes = screen.getAllByRole('checkbox')
      const firstRowCheckbox = checkboxes[1]

      await user.click(firstRowCheckbox)

      expect(handleSelectionChange).toHaveBeenCalled()
    })

    it('should show selection count', async () => {
      const user = userEvent.setup()

      render(
        <DataTable
          columns={selectableColumns}
          data={mockData}
          enableRowSelection={true}
          enablePagination={true}
        />,
      )

      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[1])

      expect(screen.getByText(/1 of 5 row\(s\) selected/)).toBeInTheDocument()
    })

    it('should select all rows', async () => {
      const user = userEvent.setup()

      render(
        <DataTable
          columns={selectableColumns}
          data={mockData}
          enableRowSelection={true}
          enablePagination={true}
        />,
      )

      const checkboxes = screen.getAllByRole('checkbox')
      const headerCheckbox = checkboxes[0]

      await user.click(headerCheckbox)

      expect(screen.getByText(/5 of 5 row\(s\) selected/)).toBeInTheDocument()
    })

    it('should not show selection count when enableRowSelection is false', () => {
      render(
        <DataTable
          columns={basicColumns}
          data={mockData}
          enableRowSelection={false}
          enablePagination={true}
        />,
      )

      expect(screen.queryByText(/row\(s\) selected/)).not.toBeInTheDocument()
    })

    it('should mark selected rows with data-state', async () => {
      const user = userEvent.setup()

      render(
        <DataTable
          columns={selectableColumns}
          data={mockData}
          enableRowSelection={true}
        />,
      )

      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[1])

      const rows = screen.getAllByRole('row')
      const firstDataRow = rows[1]
      expect(firstDataRow).toHaveAttribute('data-state', 'selected')
    })
  })

  describe('Custom Cell Rendering', () => {
    const customColumns: ColumnDef<TestPerson>[] = [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <strong>{row.original.name}</strong>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <span
            className={
              row.original.status === 'active'
                ? 'text-green-600'
                : 'text-red-600'
            }
          >
            {row.original.status}
          </span>
        ),
      },
    ]

    it('should render custom cell components', () => {
      render(<DataTable columns={customColumns} data={mockData} />)

      const nameCell = screen.getByText('John Doe')
      expect(nameCell.tagName).toBe('STRONG')
    })

    it('should apply custom cell classes', () => {
      render(<DataTable columns={customColumns} data={mockData} />)

      const activeStatus = screen.getAllByText('active')[0]
      expect(activeStatus).toHaveClass('text-green-600')

      const inactiveStatus = screen.getAllByText('inactive')[0]
      expect(inactiveStatus).toHaveClass('text-red-600')
    })
  })

  describe('Edge Cases', () => {
    it('should handle single row', () => {
      render(<DataTable columns={basicColumns} data={[mockData[0]]} />)

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      const rows = screen.getAllByRole('row')
      expect(rows).toHaveLength(2)
    })

    it('should handle single column', () => {
      const singleColumn: ColumnDef<TestPerson>[] = [
        {
          accessorKey: 'name',
          header: 'Name',
        },
      ]

      render(<DataTable columns={singleColumn} data={mockData} />)

      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.queryByText('Email')).not.toBeInTheDocument()
    })

    it('should handle very long text in cells', () => {
      const longTextData: TestPerson[] = [
        {
          id: 1,
          name: 'A'.repeat(100),
          email: 'test@example.com',
          age: 30,
          status: 'active',
        },
      ]

      render(<DataTable columns={basicColumns} data={longTextData} />)

      expect(screen.getByText('A'.repeat(100))).toBeInTheDocument()
    })

    it('should handle data updates', () => {
      const { rerender } = render(
        <DataTable columns={basicColumns} data={mockData} />,
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()

      const newData: TestPerson[] = [
        {
          id: 10,
          name: 'New Person',
          email: 'new@example.com',
          age: 40,
          status: 'active',
        },
      ]

      rerender(<DataTable columns={basicColumns} data={newData} />)

      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
      expect(screen.getByText('New Person')).toBeInTheDocument()
    })

    it('should handle empty column header', () => {
      const columnsWithEmptyHeader: ColumnDef<TestPerson>[] = [
        {
          accessorKey: 'name',
          header: '',
        },
      ]

      render(<DataTable columns={columnsWithEmptyHeader} data={mockData} />)

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  describe('Integration', () => {
    it('should work with sorting and pagination together', async () => {
      const user = userEvent.setup()

      const largeData = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `Person ${String.fromCharCode(90 - (i % 26))}`,
        email: `person${i + 1}@example.com`,
        age: 20 + i,
        status: i % 2 === 0 ? ('active' as const) : ('inactive' as const),
      }))

      render(
        <DataTable
          columns={sortableColumns}
          data={largeData}
          enableSorting={true}
          enablePagination={true}
          defaultPageSize={10}
        />,
      )

      const nameHeader = screen.getByText('Name')
      await user.click(nameHeader)

      expect(screen.getByText(/Page 1 of/)).toBeInTheDocument()
    })

    it('should work with row selection and pagination', async () => {
      const user = userEvent.setup()

      const selectableColumns: ColumnDef<TestPerson>[] = [
        {
          id: 'select',
          header: ({ table }) => (
            <input
              type="checkbox"
              checked={table.getIsAllPageRowsSelected()}
              onChange={table.getToggleAllPageRowsSelectedHandler()}
            />
          ),
          cell: ({ row }) => (
            <input
              type="checkbox"
              checked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          ),
        },
        ...basicColumns,
      ]

      render(
        <DataTable
          columns={selectableColumns}
          data={mockData}
          enableRowSelection={true}
          enablePagination={true}
        />,
      )

      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[1])

      expect(screen.getByText(/1 of 5 row\(s\) selected/)).toBeInTheDocument()
    })

    it('should handle all features disabled', () => {
      render(
        <DataTable
          columns={basicColumns}
          data={mockData}
          enableSorting={false}
          enableFiltering={false}
          enableColumnVisibility={false}
          enableRowSelection={false}
          enablePagination={false}
        />,
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.queryByText('Previous')).not.toBeInTheDocument()
    })

    it('should handle all features enabled', () => {
      const selectableColumns: ColumnDef<TestPerson>[] = [
        {
          id: 'select',
          header: ({ table }) => (
            <input
              type="checkbox"
              checked={table.getIsAllPageRowsSelected()}
              onChange={table.getToggleAllPageRowsSelectedHandler()}
            />
          ),
          cell: ({ row }) => (
            <input
              type="checkbox"
              checked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          ),
        },
        ...sortableColumns,
      ]

      render(
        <DataTable
          columns={selectableColumns}
          data={mockData}
          enableSorting={true}
          enableFiltering={true}
          enableColumnVisibility={true}
          enableRowSelection={true}
          enablePagination={true}
        />,
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Previous')).toBeInTheDocument()
      expect(screen.getByText(/row\(s\) selected/)).toBeInTheDocument()
    })

    it('should handle grouped columns with placeholder headers', () => {
      const groupedColumns: ColumnDef<TestPerson>[] = [
        {
          id: 'info',
          header: 'Personal Info',
          columns: [
            {
              accessorKey: 'name',
              header: 'Name',
            },
            {
              accessorKey: 'age',
              header: 'Age',
            },
          ],
        },
        {
          id: 'contact',
          header: 'Contact',
          columns: [
            {
              accessorKey: 'email',
              header: 'Email',
            },
            {
              accessorKey: 'status',
              header: 'Status',
            },
          ],
        },
      ]

      render(<DataTable columns={groupedColumns} data={mockData} />)

      expect(screen.getByText('Personal Info')).toBeInTheDocument()
      expect(screen.getByText('Contact')).toBeInTheDocument()

      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('should handle display columns without header', () => {
      const columnsWithDisplay: ColumnDef<TestPerson>[] = [
        {
          accessorKey: 'name',
          header: 'Name',
        },
        {
          id: 'actions',

          cell: () => <button>Actions</button>,
        },
      ]

      render(<DataTable columns={columnsWithDisplay} data={mockData} />)

      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getAllByText('Actions')).toHaveLength(mockData.length)
    })
  })
})
