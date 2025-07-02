import { render, screen } from '@testing-library/react';
import Panel from '../Panel';

jest.mock('../styles/Panel.module.css', () => ({
  panel: 'Panel-module__panel',
  default: 'Panel-module__default',
  none: 'Panel-module__none',
}));

describe('Panel', () => {
  it('renders children', () => {
    render(<Panel>Panel Content</Panel>);
    expect(screen.getByText('Panel Content')).toBeInTheDocument();
  });

  it('renders header when provided', () => {
    render(<Panel header="Test Header">Panel Content</Panel>);
    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  it('renders header icon when provided', () => {
    const TestIcon = () => <span automation-id="test-icon">Icon</span>;
    render(
      <Panel header="Test Header" headerIcon={<TestIcon />}>
        Panel Content
      </Panel>,
    );
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders action button when provided', () => {
    const ActionButton = () => <button>Action</button>;
    render(
      <Panel header="Test Header" headerActionButton={<ActionButton />}>
        Panel Content
      </Panel>,
    );
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(<Panel footer={<div>Footer Content</div>}>Panel Content</Panel>);
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('renders footer divider when footerDivider is true', () => {
    render(
      <Panel footer={<div>Footer Content</div>} footerDivider automation-id="panel-footer-divider">
        Panel Content
      </Panel>,
    );
    expect(screen.getByTestId('panel-footer-divider')).toBeInTheDocument();
  });

  it('applies no border style when specified', () => {
    render(<Panel border="none">Panel Content</Panel>);
    expect(screen.getByText('Panel Content').parentElement).toHaveClass('Panel-module__none');
  });

  it('renders section alert when provided', () => {
    render(<Panel sectionAlert={<div>Alert</div>}>Panel Content</Panel>);
    expect(screen.getByText('Alert')).toBeInTheDocument();
  });

  it('does not render header when no header props are provided', () => {
    render(<Panel>Panel Content</Panel>);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('does not render footer when not provided', () => {
    render(<Panel>Panel Content</Panel>);
    expect(screen.queryByText('Footer Content')).not.toBeInTheDocument();
  });
});
