import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as MUIThemeProvider } from '@mui/material';
import { ThemeProvider } from 'sds-ui';
import { lightTheme } from 'mui-themes';

const queryClient = new QueryClient();

type ProvidersProps = PropsWithChildren;

function Providers({ children }: ProvidersProps) {
  return (
    <MUIThemeProvider theme={lightTheme}>
      <ThemeProvider defaultTheme="tsc-light">
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ThemeProvider>
    </MUIThemeProvider>
  );
}

export default Providers;
