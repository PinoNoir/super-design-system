export function generateProvidersComponent(
  useTypeScript: boolean,
  theme?: string,
  productType?: string
): string {
  const typeAnnotation = useTypeScript ? ': React.ReactNode' : '';
  const defaultTheme = theme || 'tsc-light';
  const productName = productType ?
    productType.toUpperCase() === 'BCC' ? 'BCC' :
    productType.toUpperCase() === 'TSC' ? 'TSC' :
    productType.toUpperCase() === 'CORE' ? 'CORE' :
    'SDS' : 'SDS';

  return `import { ThemeProvider } from '@pinonoir/sds-ui';
import '@pinonoir/sds-ui/component-styles';

interface ProvidersProps {
  children${typeAnnotation};
}

/**
 * Application providers wrapper
 * ${productName ? `Configured for ${productName} with theme: ${defaultTheme}` : `Configured with theme: ${defaultTheme}`}
 */
export default function Providers({ children }${useTypeScript ? ': ProvidersProps' : ''}) {
  return (
    <ThemeProvider defaultTheme="${defaultTheme}">
      {children}
    </ThemeProvider>
  );
}
`;
}

export function generateAppComponent(framework: string, _useTypeScript: boolean): string {
  if (framework === 'nextjs') {
    return generateNextAppComponent();
  }

  return generateReactAppComponent();
}

function generateReactAppComponent(): string {
  return `import { useState } from 'react';
import { Button, Card } from '@pinonoir/sds-ui';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <h1>Super Design System</h1>
      <Card>
        <h2>Welcome to your SDS project!</h2>
        <p>
          Click the button below to get started.
        </p>
        <Button onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </Button>
      </Card>
    </div>
  );
}

export default App;
`;
}

function generateNextAppComponent(): string {
  return `'use client';

import { useState } from 'react';
import { Button, Card } from '@pinonoir/sds-ui';

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Super Design System</h1>
      <Card>
        <h2>Welcome to your SDS project!</h2>
        <p>Click the button below to get started.</p>
        <Button onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </Button>
      </Card>
    </main>
  );
}
`;
}
