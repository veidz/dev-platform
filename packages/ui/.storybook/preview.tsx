import '../src/styles/globals.css'

import type { Preview } from '@storybook/react-vite'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
      default: 'dark',
    },
    docs: {
      theme: {
        base: 'dark',
        colorPrimary: '#3b82f6',
        colorSecondary: '#3b82f6',
        appBg: '#0c1222',
        appContentBg: '#0c1222',
        appBorderColor: '#1e293b',
        textColor: '#f8fafc',
        textInverseColor: '#0c1222',
        barTextColor: '#94a3b8',
        barSelectedColor: '#3b82f6',
        barBg: '#0c1222',
        inputBg: '#1e293b',
        inputBorder: '#1e293b',
        inputTextColor: '#f8fafc',
        inputBorderRadius: 8,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const isDocs = context.viewMode === 'docs'
      return (
        <div
          className={`bg-background text-foreground ${isDocs ? 'p-0' : 'min-h-screen p-6'}`}
        >
          <Story />
        </div>
      )
    },
  ],
}

export default preview
