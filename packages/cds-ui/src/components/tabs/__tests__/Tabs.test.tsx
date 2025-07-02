import { render, screen, fireEvent, act } from '@testing-library/react';
import Tabs from '../Tabs';

describe('Tabs Component', () => {
  const mockTabItems = [
    { id: 'tab1', tabLabel: 'Tab 1', tabContent: <div>Content 1</div> },
    { id: 'tab2', tabLabel: 'Tab 2', tabContent: <div>Content 2</div> },
    { id: 'tab3', tabLabel: 'Tab 3', tabContent: <div>Content 3</div> },
    { id: 'tab4', tabLabel: 'Tab 4', tabContent: <div>Content 4</div> },
    { id: 'tab5', tabLabel: 'Tab 5', tabContent: <div>Content 5</div> },
    { id: 'tab6', tabLabel: 'Tab 6', tabContent: <div>Content 6</div> },
    { id: 'tab7', tabLabel: 'Tab 7', tabContent: <div>Content 7</div> },
    { id: 'tab8', tabLabel: 'Tab 8', tabContent: <div>Content 8</div> },
    { id: 'tab9', tabLabel: 'Tab 9', tabContent: <div>Content 9</div> },
    { id: 'tab10', tabLabel: 'Tab 10', tabContent: <div>Content 10</div> },
  ];

  it('renders all tab labels', () => {
    render(<Tabs tabItems={mockTabItems} />);
    mockTabItems.forEach((tab) => {
      expect(screen.getByText(tab.tabLabel)).toBeInTheDocument();
    });
  });

  it('displays the content of the first tab by default', () => {
    render(<Tabs tabItems={mockTabItems} />);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
  });

  it('changes content when a different tab is clicked', () => {
    render(<Tabs tabItems={mockTabItems} />);
    fireEvent.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
  });

  it('applies active class to the active tab', () => {
    render(<Tabs tabItems={mockTabItems} />);
    expect(screen.getByText('Tab 1')).toHaveClass('tab activeTab');
    expect(screen.getByText('Tab 2')).toHaveClass('tab inactiveTab');
  });

  it('renders scroll arrows when content is overflowing', () => {
    // Mock the ResizeObserver
    const mockResizeObserver = jest.fn();
    mockResizeObserver.mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
    window.ResizeObserver = mockResizeObserver;

    // Render the component
    render(<Tabs tabItems={mockTabItems} />);

    // Mock the overflow scenario on the specific element
    const tabHeaderElement = screen.getByTestId('tab-header');
    Object.defineProperty(tabHeaderElement, 'offsetWidth', { configurable: true, value: 100 });
    Object.defineProperty(tabHeaderElement, 'scrollWidth', { configurable: true, value: 200 });

    // Trigger the resize event to check for overflow
    fireEvent(window, new Event('resize'));

    // Check if scroll arrows are rendered
    expect(screen.getByTestId('left-arrow')).toBeInTheDocument();
    expect(screen.getByTestId('right-arrow')).toBeInTheDocument();

    // Clean up
    delete window.ResizeObserver;
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
    render(<Tabs tabItems={mockTabItems} />);

    // Initially, scroll arrows should not be present
    expect(screen.queryByTestId('left-scroll-arrow')).not.toBeInTheDocument();
    expect(screen.queryByTestId('right-scroll-arrow')).not.toBeInTheDocument();

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
