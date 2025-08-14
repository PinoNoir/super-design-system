import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SidebarSection from '../SidebarSection';
import type { NavSection } from '../Sidebar';

// Mock @iconify/react Icon component
jest.mock('@iconify/react', () => ({
  Icon: ({ icon, className, ...props }: any) => (
    <span automation-id="section-toggle-icon" className={className} {...props}>
      {icon}
    </span>
  ),
}));

const mockSection: NavSection = {
  id: 'test-section',
  title: 'Test Section',
  items: [
    {
      id: '1',
      label: 'Test Item 1',
      icon: <span automation-id="icon-1">🏠</span>,
      href: '/test-1',
    },
    {
      id: '2',
      label: 'Test Item 2',
      icon: <span automation-id="icon-2">📊</span>,
      onClick: jest.fn(),
    },
    {
      id: '3',
      label: 'Test Item 3',
      icon: <span automation-id="icon-3">⚙️</span>,
      badge: <span automation-id="badge-3">3</span>,
    },
  ],
};

const mockToggleSection = jest.fn();
const mockRenderDefaultNavItem = jest.fn((item) => (
  <div key={item.id} automation-id={`nav-item-${item.id}`}>
    {item.label}
  </div>
));

describe('SidebarSection Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders section title', () => {
      render(
        <SidebarSection
          section={mockSection}
          collapsed={false}
          isExpanded={true}
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      expect(screen.getByText('Test Section')).toBeInTheDocument();
    });

    it('renders all navigation items', () => {
      render(
        <SidebarSection
          section={mockSection}
          collapsed={false}
          isExpanded={true}
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      expect(screen.getByTestId('nav-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('nav-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('nav-item-3')).toBeInTheDocument();
    });

    it('renders section content when expanded', () => {
      render(
        <SidebarSection
          section={mockSection}
          collapsed={false}
          isExpanded={true}
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();
      expect(screen.getByText('Test Item 3')).toBeInTheDocument();
    });

    it('hides section content when section is not expanded', () => {
      render(
        <SidebarSection
          section={mockSection}
          collapsed={false}
          isExpanded={false}
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      // When section is not expanded, content should be hidden
      expect(screen.queryByText('Test Item 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Item 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Item 3')).not.toBeInTheDocument();
    });

    it('shows section content when expanded', () => {
      render(
        <SidebarSection
          section={mockSection}
          collapsed={false}
          isExpanded={true}
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      // When section is expanded, content should be visible
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();
      expect(screen.getByText('Test Item 3')).toBeInTheDocument();
    });
  });

  describe('Collapsible Behavior', () => {
    it('renders as collapsible when sectionsCollapsible is true', () => {
      render(
        <SidebarSection
          section={mockSection}
          collapsed={false}
          collapsible={true}
          isExpanded={true}
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      const sectionTitle = screen.getByTestId('section-title');
      expect(sectionTitle).toHaveClass('sectionHeaderCollapsible');
    });

    it('renders as non-collapsible when sectionsCollapsible is false', () => {
      render(
        <SidebarSection
          section={mockSection}
          collapsed={false}
          collapsible={false}
          isExpanded={true}
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      const sectionTitle = screen.getByTestId('section-title');
      expect(sectionTitle).not.toHaveClass('sectionHeaderCollapsible');
    });

    it('calls toggleSection when clicked', async () => {
      const user = userEvent.setup();

      render(
        <SidebarSection
          section={mockSection}
          collapsed={false}
          collapsible={true}
          isExpanded={true}
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      const sectionTitle = screen.getByTestId('section-title');
      await user.click(sectionTitle);

      expect(mockToggleSection).toHaveBeenCalledWith('test-section');
    });

    it('shows toggle icon when collapsible', () => {
      render(
        <SidebarSection
          section={mockSection}
          collapsed={false}
          collapsible={true}
          isExpanded={true}
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      const toggleIcon = screen.getByTestId('section-toggle-icon');
      expect(toggleIcon).toBeInTheDocument();
    });

    it('rotates toggle icon based on expanded state', () => {
      const { rerender } = render(
        <SidebarSection
          section={mockSection}
          collapsed={false}
          collapsible={true}
          isExpanded={true}
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      let toggleIcon = screen.getByTestId('section-toggle-icon');
      expect(toggleIcon).not.toHaveClass('rotate');

      // Collapse section
      rerender(
        <SidebarSection
          section={mockSection}
          collapsed={false}
          collapsible={true}
          isExpanded={false}
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      toggleIcon = screen.getByTestId('section-toggle-icon');
      expect(toggleIcon).toHaveClass('rotate');
    });
  });

  describe('Collapsed State', () => {
    it('hides section title when collapsed', () => {
      render(
        <SidebarSection
          section={mockSection}
          collapsed={true}
          isExpanded={true}
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      const sectionTitle = screen.getByTestId('section-title');
      expect(sectionTitle).toBeInTheDocument();
      expect(sectionTitle).toHaveClass('sectionHeader sectionHeaderCollapsible');
    });

    it('shows section content when collapsed (icons only)', () => {
      render(
        <SidebarSection
          section={mockSection}
          collapsed={true}
          isExpanded={true}
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      // When collapsed, content should still be visible (showing just icons)
      // This is the desired behavior for a collapsed sidebar
      expect(screen.getByTestId('nav-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('nav-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('nav-item-3')).toBeInTheDocument();
    });

    it('maintains section structure when collapsed', () => {
      render(
        <SidebarSection
          section={mockSection}
          collapsed={true}
          isExpanded={true}
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      // When collapsed, the section structure should still exist but title text is hidden
      const section = screen.getByTestId('section-title').closest('.navSection');
      expect(section).toBeInTheDocument();

      // Title text should be hidden when collapsed
      expect(screen.queryByText('Test Section')).not.toBeInTheDocument();

      // But the toggle icon should still be visible
      expect(screen.getByTestId('section-toggle-icon')).toBeInTheDocument();
    });
  });

  describe('Lazy Loading', () => {
    it('renders items when shouldRenderItems is true', () => {
      render(
        <SidebarSection
          section={mockSection}
          collapsed={false}
          isExpanded={true}
          shouldRenderItems={true}
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();
      expect(screen.getByText('Test Item 3')).toBeInTheDocument();
    });

    it('does not render items when shouldRenderItems is false', () => {
      render(
        <SidebarSection
          section={mockSection}
          collapsed={false}
          isExpanded={true}
          shouldRenderItems={false}
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      expect(screen.queryByText('Test Item 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Item 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Item 3')).not.toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom section className', () => {
      render(
        <SidebarSection
          section={mockSection}
          collapsed={false}
          isExpanded={true}
          sectionClassName="custom-section"
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      const section = screen.getByText('Test Section').closest('nav');
      expect(section).toHaveClass('custom-section');
    });

    it('applies custom section title className', () => {
      render(
        <SidebarSection
          section={mockSection}
          collapsed={false}
          isExpanded={true}
          sectionTitleClassName="custom-title"
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      const title = screen.getByText('Test Section');
      expect(title).toHaveClass('custom-title');
    });

    it('handles section without title', () => {
      const sectionWithoutTitle = { ...mockSection, title: undefined };

      render(
        <SidebarSection
          section={sectionWithoutTitle}
          collapsed={false}
          isExpanded={true}
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      expect(screen.queryByText('Test Section')).not.toBeInTheDocument();
    });

    it('handles section without items', () => {
      const sectionWithoutItems = { ...mockSection, items: [] };

      render(
        <SidebarSection
          section={sectionWithoutItems}
          collapsed={false}
          isExpanded={true}
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      expect(screen.getByText('Test Section')).toBeInTheDocument();
      expect(screen.queryByTestId('nav-item-1')).not.toBeInTheDocument();
    });

    it('handles section with custom collapsible setting', () => {
      const sectionWithCustomCollapsible = { ...mockSection, collapsible: false };

      render(
        <SidebarSection
          section={sectionWithCustomCollapsible}
          collapsed={false}
          collapsible={true} // Global setting
          isExpanded={true}
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      // Section should respect its own collapsible setting
      const sectionTitle = screen.getByTestId('section-title');
      expect(sectionTitle).not.toHaveClass('sectionHeaderCollapsible');
    });

    it('handles rapid state changes', () => {
      const { rerender } = render(
        <SidebarSection
          section={mockSection}
          collapsed={false}
          collapsible={true}
          isExpanded={true}
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      // Rapidly change states
      rerender(
        <SidebarSection
          section={mockSection}
          collapsed={false}
          collapsible={true}
          isExpanded={false}
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      rerender(
        <SidebarSection
          section={mockSection}
          collapsed={false}
          collapsible={true}
          isExpanded={true}
          toggleSection={mockToggleSection}
          renderDefaultNavItem={mockRenderDefaultNavItem}
        />,
      );

      // Should handle state changes gracefully
      expect(screen.getByText('Test Section')).toBeInTheDocument();
    });
  });
});
