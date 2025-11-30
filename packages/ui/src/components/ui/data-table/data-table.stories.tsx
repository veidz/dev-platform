import { JSX, useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { DataTable } from './data-table'

const meta = {
  title: 'UI/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
}

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  inStock: boolean
}

const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'active',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'User',
    status: 'inactive',
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice@example.com',
    role: 'Editor',
    status: 'active',
  },
  {
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'User',
    status: 'pending',
  },
  {
    id: '6',
    name: 'Diana Prince',
    email: 'diana@example.com',
    role: 'Admin',
    status: 'active',
  },
  {
    id: '7',
    name: 'Eve Davis',
    email: 'eve@example.com',
    role: 'Editor',
    status: 'active',
  },
  {
    id: '8',
    name: 'Frank Miller',
    email: 'frank@example.com',
    role: 'User',
    status: 'inactive',
  },
  {
    id: '9',
    name: 'Grace Lee',
    email: 'grace@example.com',
    role: 'User',
    status: 'active',
  },
  {
    id: '10',
    name: 'Henry Wilson',
    email: 'henry@example.com',
    role: 'Editor',
    status: 'pending',
  },
  {
    id: '11',
    name: 'Iris Moore',
    email: 'iris@example.com',
    role: 'Admin',
    status: 'active',
  },
  {
    id: '12',
    name: 'Jack Taylor',
    email: 'jack@example.com',
    role: 'User',
    status: 'inactive',
  },
]

const sampleProducts: Product[] = [
  {
    id: 'P001',
    name: 'Laptop Pro',
    category: 'Electronics',
    price: 1299.99,
    stock: 45,
    inStock: true,
  },
  {
    id: 'P002',
    name: 'Wireless Mouse',
    category: 'Accessories',
    price: 29.99,
    stock: 150,
    inStock: true,
  },
  {
    id: 'P003',
    name: 'Mechanical Keyboard',
    category: 'Accessories',
    price: 89.99,
    stock: 0,
    inStock: false,
  },
  {
    id: 'P004',
    name: 'USB-C Hub',
    category: 'Accessories',
    price: 49.99,
    stock: 80,
    inStock: true,
  },
  {
    id: 'P005',
    name: '27" Monitor',
    category: 'Electronics',
    price: 399.99,
    stock: 25,
    inStock: true,
  },
]

const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }): React.JSX.Element => {
      const status = row.getValue('status') as string
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            status === 'active'
              ? 'bg-green-500/10 text-green-500'
              : status === 'inactive'
                ? 'bg-red-500/10 text-red-500'
                : 'bg-yellow-500/10 text-yellow-500'
          }`}
        >
          {status}
        </span>
      )
    },
  },
]

const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Product',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }): string => {
      const price = row.getValue('price') as number
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price)
    },
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
  },
  {
    accessorKey: 'inStock',
    header: 'Status',
    cell: ({ row }): React.JSX.Element => {
      const inStock = row.getValue('inStock') as boolean
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            inStock
              ? 'bg-green-500/10 text-green-500'
              : 'bg-red-500/10 text-red-500'
          }`}
        >
          {inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      )
    },
  },
]

export const Default: Story = {
  args: {
    columns: userColumns as unknown as Story['args']['columns'],
    data: sampleUsers,
    enablePagination: true,
    enableSorting: true,
  },
}

export const WithProducts: Story = {
  args: {
    columns: productColumns as unknown as Story['args']['columns'],
    data: sampleProducts,
    enablePagination: false,
    enableSorting: true,
  },
}

export const Sortable: Story = {
  args: {
    columns: userColumns as unknown as Story['args']['columns'],
    data: sampleUsers,
    enablePagination: true,
    enableSorting: true,
  },
}

export const WithRowSelection = {
  render: (): JSX.Element => {
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])

    const selectableColumns: ColumnDef<User>[] = [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="h-4 w-4 rounded border-gray-300"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="h-4 w-4 rounded border-gray-300"
          />
        ),
        enableSorting: false,
      },
      ...userColumns,
    ]

    return (
      <div className="space-y-4">
        <DataTable
          columns={selectableColumns}
          data={sampleUsers}
          enableRowSelection
          enablePagination
          enableSorting
          onRowSelectionChange={setSelectedUsers}
        />
        {selectedUsers.length > 0 && (
          <div className="rounded-md bg-muted p-4">
            <p className="mb-2 text-sm font-medium">
              Selected {selectedUsers.length} user(s):
            </p>
            <ul className="space-y-1 text-sm">
              {selectedUsers.map((user) => (
                <li key={user.id}>
                  {user.name} ({user.email})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  },
}

export const WithFiltering = {
  render: (): JSX.Element => {
    const [globalFilter, setGlobalFilter] = useState('')

    const filterableColumns: ColumnDef<User>[] = [
      {
        accessorKey: 'name',
        header: 'Name',
        filterFn: 'includesString',
      },
      {
        accessorKey: 'email',
        header: 'Email',
        filterFn: 'includesString',
      },
      {
        accessorKey: 'role',
        header: 'Role',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }): JSX.Element => {
          const status = row.getValue('status') as string
          return (
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                status === 'active'
                  ? 'bg-green-500/10 text-green-500'
                  : status === 'inactive'
                    ? 'bg-red-500/10 text-red-500'
                    : 'bg-yellow-500/10 text-yellow-500'
              }`}
            >
              {status}
            </span>
          )
        },
      },
    ]

    const filteredData = globalFilter
      ? sampleUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
            user.email.toLowerCase().includes(globalFilter.toLowerCase()) ||
            user.role.toLowerCase().includes(globalFilter.toLowerCase()),
        )
      : sampleUsers

    return (
      <div className="space-y-4">
        <Input
          placeholder="Search users..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <DataTable
          columns={filterableColumns}
          data={filteredData}
          enablePagination
          enableSorting
          enableFiltering
        />
      </div>
    )
  },
}

export const WithActions = {
  render: (): JSX.Element => {
    const actionsColumns: ColumnDef<User>[] = [
      ...userColumns,
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }): JSX.Element => {
          const user = row.original
          return (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert(`Edit user: ${user.name}`)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => alert(`Delete user: ${user.name}`)}
              >
                Delete
              </Button>
            </div>
          )
        },
      },
    ]

    return (
      <DataTable
        columns={actionsColumns}
        data={sampleUsers}
        enablePagination
        enableSorting
      />
    )
  },
}

export const Empty: Story = {
  args: {
    columns: userColumns as unknown as Story['args']['columns'],
    data: [],
    emptyMessage: 'No users found. Add your first user to get started.',
  },
}

export const LargeDataset: Story = {
  args: {
    columns: userColumns as unknown as Story['args']['columns'],
    data: Array.from({ length: 100 }, (_, i) => ({
      id: `${i + 1}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: ['Admin', 'User', 'Editor'][i % 3],
      status: ['active', 'inactive', 'pending'][i % 3] as User['status'],
    })),
    enablePagination: true,
    enableSorting: true,
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
  },
}
