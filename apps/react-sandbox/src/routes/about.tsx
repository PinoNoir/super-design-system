import { createFileRoute } from '@tanstack/react-router';
import { Button, Tooltip, Box } from 'sds-ui';

export const Route = createFileRoute('/about')({
  component: AboutComponent,
});

function AboutComponent() {
  return (
    <Box p="24">
      <h1>About</h1>
      <Tooltip description="This is a tooltip">
        <Button variant="primary">Click me</Button>
      </Tooltip>
    </Box>
  );
}
