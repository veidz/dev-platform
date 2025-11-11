import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { CodeEditor } from './code-editor'

const meta = {
  title: 'UI/CodeEditor',
  component: CodeEditor,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CodeEditor>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValue:
      '// Start coding...\nfunction hello() {\n  console.log("Hello, World!");\n}',
    language: 'javascript',
    height: '400px',
  },
}

export const TypeScript: Story = {
  args: {
    defaultValue: `interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com"
};

console.log(user);`,
    language: 'typescript',
    height: '400px',
  },
}

export const JSON: Story = {
  args: {
    defaultValue: `{
  "name": "@dev-platform/ui",
  "version": "0.1.0",
  "description": "UI components library",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}`,
    language: 'json',
    height: '400px',
  },
}

export const HTML: Story = {
  args: {
    defaultValue: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is a sample HTML document.</p>
</body>
</html>`,
    language: 'html',
    height: '400px',
  },
}

export const CSS: Story = {
  args: {
    defaultValue: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.button {
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}`,
    language: 'css',
    height: '400px',
  },
}

export const ReadOnly: Story = {
  args: {
    defaultValue: `// This editor is read-only
const API_KEY = "your-api-key-here";
const API_URL = "https://api.example.com";

// Do not modify these constants`,
    language: 'javascript',
    readOnly: true,
    height: '300px',
  },
}

export const WithControlled: Story = {
  render: () => {
    const [code, setCode] = useState(
      '// Edit this code and see the value below\nconst message = "Hello, World!";',
    )

    return (
      <div className="space-y-4">
        <CodeEditor
          value={code}
          language="javascript"
          height="200px"
          onChange={(value) => setCode(value || '')}
        />
        <div className="rounded-md bg-muted p-4">
          <p className="mb-2 text-sm font-medium">Current value:</p>
          <pre className="text-xs">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    )
  },
}

export const Python: Story = {
  args: {
    defaultValue: `def fibonacci(n):
    """Calculate the nth Fibonacci number."""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Print first 10 Fibonacci numbers
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`,
    language: 'python',
    height: '400px',
  },
}

export const SQL: Story = {
  args: {
    defaultValue: `SELECT
  u.id,
  u.name,
  u.email,
  COUNT(o.id) as order_count,
  SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id, u.name, u.email
ORDER BY total_spent DESC
LIMIT 10;`,
    language: 'sql',
    height: '400px',
  },
}
