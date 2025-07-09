import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from '../';
import type { NavSection } from '../Sidebar';

beforeAll(() => {
  window.scrollTo = jest.fn();
});

const mockSections: NavSection[] = [
  {
    id: 'main',
    title: 'Main Navigation',
    items: [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'dashboard', label: 'Dashboard', onClick: jest.fn() },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    items: [{ id: 'profile', label: 'Profile', onClick: jest.fn() }],
  },
];

describe('Sidebar Accordion Behavior', () => {
  it('toggles multiple sections independently', async () => {
    const user = userEvent.setup();
    render(<Sidebar sections={mockSections} defaultExpandedSections={{ main: true, settings: true }} />);

    const mainToggle = screen.getByRole('button', { name: /main navigation/i });
    const settingsToggle = screen.getByRole('button', { name: /settings/i });

    expect(screen.getByText('Home')).toBeVisible();
    expect(screen.getByText('Profile')).toBeVisible();

    await user.click(mainToggle);
    await waitFor(
      () => {
        const mainSection = screen.getByRole('button', { name: /main navigation/i });
        expect(mainSection).toHaveAttribute('aria-expanded', 'false');
      },
      { timeout: 1000 },
    );
    expect(screen.getByText('Profile')).toBeVisible();

    await user.click(settingsToggle);
    await waitFor(
      () => {
        const settingsSection = screen.getByRole('button', { name: /settings/i });
        expect(settingsSection).toHaveAttribute('aria-expanded', 'false');
      },
      { timeout: 1000 },
    );

    await user.click(mainToggle);
    await waitFor(
      () => {
        const mainSection = screen.getByRole('button', { name: /main navigation/i });
        expect(mainSection).toHaveAttribute('aria-expanded', 'true');
      },
      { timeout: 1000 },
    );
  });

  it('hides section titles and disables toggling when sidebar is collapsed', async () => {
    const user = userEvent.setup();
    render(<Sidebar sections={mockSections} collapsed />);

    expect(screen.queryByText('Main Navigation')).not.toBeInTheDocument();
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();

    const toggleButtons = screen.queryAllByRole('button', { name: /navigation/i });
    expect(toggleButtons.length).toBe(0);

    expect(screen.queryByText('Home')).not.toBeInTheDocument();
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();

    const dashboardButton = screen.getByTestId('nav-dashboard');
    await user.click(dashboardButton);
    expect(mockSections[0].items[1].onClick).toHaveBeenCalledTimes(1);
  });

  it('responds to collapsed prop changes and updates UI accordingly', async () => {
    const { rerender } = render(<Sidebar sections={mockSections} collapsed={false} />);

    expect(screen.getByText('Main Navigation')).toBeVisible();
    expect(screen.getByText('Settings')).toBeVisible();
    expect(screen.getByRole('button', { name: /main navigation/i })).toBeInTheDocument();

    rerender(<Sidebar sections={mockSections} collapsed={true} />);

    expect(screen.queryByText('Main Navigation')).not.toBeInTheDocument();
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /main navigation/i })).not.toBeInTheDocument();

    rerender(<Sidebar sections={mockSections} collapsed={false} />);

    expect(screen.getByText('Main Navigation')).toBeVisible();
    expect(screen.getByText('Settings')).toBeVisible();
    expect(screen.getByRole('button', { name: /main navigation/i })).toBeInTheDocument();
  });
});
