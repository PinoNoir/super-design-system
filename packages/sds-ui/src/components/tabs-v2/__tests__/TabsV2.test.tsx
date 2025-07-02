import { render, screen, fireEvent, act } from '@testing-library/react';
import TabsV2 from '../TabsV2';

describe('TabsV2 Component', () => {
  const mockTabs = [
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2' },
    { id: 'tab3', label: 'Tab 3' },
    { id: 'tab4', label: 'Tab 4' },
    { id: 'tab5', label: 'Tab 5' },
    { id: 'tab6', label: 'Tab 6' },
    { id: 'tab7', label: 'Tab 7' },
    { id: 'tab8', label: 'Tab 8' },
    { id: 'tab9', label: 'Tab 9' },
    { id: 'tab10', label: 'Tab 10' },
  ];

  const renderComponent = (activeTab = 'tab1') => {
    const onTabChange = jest.fn();
    render(<TabsV2 tabs={mockTabs} activeTab={activeTab} onTabChange={onTabChange} />);
    return { onTabChange };
  };

  it('renders all tab labels', () => {
    renderComponent();
    mockTabs.forEach((tab) => {
      expect(screen.getByText(tab.label)).toBeInTheDocument();
    });
  });

  it('applies active class to the active tab', () => {
    renderComponent('tab2');
    expect(screen.getByText('Tab 2')).toHaveClass('tab active');
    expect(screen.getByText('Tab 1')).not.toHaveClass('tab active');
  });

  it('calls onTabChange when a different tab is clicked', () => {
    const { onTabChange } = renderComponent();
    fireEvent.click(screen.getByText('Tab 2'));
    expect(onTabChange).toHaveBeenCalledWith('tab2');
  });

  it('scrolls tabs when arrow buttons are clicked (when overflowing)', () => {
    // Mock ResizeObserver
    const mockResizeObserver = jest.fn();
    mockResizeObserver.mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
    window.ResizeObserver = mockResizeObserver;

    // Render the component
    renderComponent();

    // Initially, scroll arrows should not be present
    expect(screen.queryByTestId('left-arrow')).not.toBeInTheDocument();
    expect(screen.queryByTestId('right-arrow')).not.toBeInTheDocument();

    // Mock the overflow scenario
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 100 });
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', { configurable: true, value: 200 });

    // Mock the scrollLeft property
    const scrollLeftMock = jest.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollLeft', {
      configurable: true,
      get: () => 0,
      set: scrollLeftMock,
    });

    // Trigger a resize event to cause a re-render
    act(() => {
      fireEvent(window, new Event('resize'));
    });

    // Now the scroll arrows should be present
    const rightArrow = screen.getByTestId('right-arrow');
    const leftArrow = screen.getByTestId('left-arrow');

    expect(rightArrow).toBeInTheDocument();
    expect(leftArrow).toBeInTheDocument();

    fireEvent.click(rightArrow);
    expect(scrollLeftMock).toHaveBeenCalledWith(expect.any(Number));

    fireEvent.click(leftArrow);
    expect(scrollLeftMock).toHaveBeenCalledWith(expect.any(Number));

    // Clean up
    delete window.ResizeObserver;
  });
});
