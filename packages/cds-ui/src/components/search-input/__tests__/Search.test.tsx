import { render, screen, fireEvent } from '@testing-library/react';
import Search from '../Search';

// Mock the styles
jest.mock('./styles/Search.module.css', () => ({
  search: 'search',
  searchDisabled: 'searchDisabled',
  searchClose: 'searchClose',
  searchCloseHidden: 'searchCloseHidden',
  searchCollapsed: 'searchCollapsed',
  searchExpanded: 'searchExpanded',
  label: 'label',
  visuallyHidden: 'visuallyHidden',
  searchMagnifier: 'searchMagnifier',
  searchInputRecipe: jest.fn(() => 'mockSearchInputStyle'),
}));

describe('Search Component', () => {
  it('renders with default props', () => {
    render(<Search />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Search className="custom-class" />);
    expect(screen.getByRole('search')).toHaveClass('custom-class');
  });

  it('renders label when provided', () => {
    render(<Search label="Search Label" hideLabel={false} />);
    expect(screen.getByText('Search Label')).toBeInTheDocument();
    expect(screen.getByText('Search Label')).not.toHaveClass('visuallyHidden');
  });

  it('hides label when hideLabel is true', () => {
    render(<Search label="Search Label" hideLabel={true} />);
    expect(screen.getByText('Search Label')).toHaveClass('visuallyHidden');
  });

  it('disables input when disabled prop is true', () => {
    render(<Search disabled />);
    expect(screen.getByRole('searchbox')).toBeDisabled();
  });

  it('calls onChange when input value changes', () => {
    const mockOnChange = jest.fn();
    render(<Search onChange={mockOnChange} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'test' } });
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('calls onClear when clear button is clicked', () => {
    const mockOnClear = jest.fn();
    const mockOnChange = jest.fn();
    render(<Search onClear={mockOnClear} onChange={mockOnChange} value="initial value" />);
    fireEvent.click(screen.getByRole('button', { name: /clear search input/i }));
    expect(mockOnClear).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: '' }),
        type: 'change',
      }),
    );
  });

  it('handles expandable search correctly', () => {
    const mockOnExpand = jest.fn();
    const { rerender } = render(<Search onExpand={mockOnExpand} isExpanded={false} />);

    expect(screen.getByRole('search')).toHaveClass('searchCollapsed');
    const searchIcon = screen.getByTestId('search-button');
    expect(searchIcon).toBeInTheDocument();

    expect(screen.queryByRole('searchbox')).toBeInTheDocument();

    fireEvent.click(searchIcon);
    expect(mockOnExpand).toHaveBeenCalled();

    // Simulate the parent component expanding the search
    rerender(<Search onExpand={mockOnExpand} isExpanded={true} />);
    expect(screen.getByRole('search')).toHaveClass('searchExpanded');
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<Search placeholder="Custom placeholder" />);
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('handles Escape key press', () => {
    const mockOnClear = jest.fn();
    render(<Search onClear={mockOnClear} value="initial value" />);
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape', code: 'Escape' });
    expect(mockOnClear).toHaveBeenCalled();
  });

  it('renders with initial value', () => {
    render(<Search value="initial value" />);
    expect(screen.getByRole('searchbox')).toHaveValue('initial value');
  });

  it('shows clear button when input has content', () => {
    render(<Search value="some content" />);
    expect(screen.getByRole('button', { name: /clear search input/i })).not.toHaveClass('searchCloseHidden');
  });

  it('hides clear button when input is empty', () => {
    render(<Search value="" />);
    expect(screen.getByRole('button', { name: /clear search input/i })).toHaveClass('searchCloseHidden');
  });

  it('handles Enter key press on expand button', () => {
    const mockOnExpand = jest.fn();
    render(<Search onExpand={mockOnExpand} isExpanded={false} />);
    const magnifier = screen.getByTestId('search-button');
    fireEvent.keyDown(magnifier, { key: 'Enter', code: 'Enter' });
    expect(mockOnExpand).toHaveBeenCalled();
  });
});
