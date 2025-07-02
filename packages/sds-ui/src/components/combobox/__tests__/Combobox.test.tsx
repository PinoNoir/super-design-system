import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Combobox from '../Combobox';

// Mock the SVG sprite import
jest.mock('../../public/bcc-icon-sprite.svg', () => 'mocked-sprite.svg');

describe('Combobox', () => {
  const defaultProps = {
    options: ['Option 1', 'Option 2', 'Option 3'],
    onSelect: jest.fn(),
    onSave: jest.fn(),
    placeholder: 'Search or enter new value',
  };

  it('renders without crashing', () => {
    render(<Combobox {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search or enter new value')).toBeInTheDocument();
  });

  it('displays options when focused', async () => {
    render(<Combobox {...defaultProps} />);
    const input = screen.getByPlaceholderText('Search or enter new value');
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });
  });

  it('filters options based on input', async () => {
    render(<Combobox {...defaultProps} />);
    const input = screen.getByPlaceholderText('Search or enter new value');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '2' } });

    await waitFor(() => {
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Option 3')).not.toBeInTheDocument();
    });
  });

  it('calls onSelect when an option is clicked', async () => {
    render(<Combobox {...defaultProps} />);
    const input = screen.getByPlaceholderText('Search or enter new value');
    fireEvent.focus(input);

    await waitFor(() => {
      fireEvent.click(screen.getByText('Option 2'));
    });

    expect(defaultProps.onSelect).toHaveBeenCalledWith('Option 2');
  });

  it('calls onSave when Enter is pressed with a new value', () => {
    render(<Combobox {...defaultProps} />);
    const input = screen.getByPlaceholderText('Search or enter new value');
    fireEvent.change(input, { target: { value: 'New Option' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(defaultProps.onSave).toHaveBeenCalledWith('New Option');
  });

  it('displays "Add New" option when allowAddNew is true', async () => {
    render(<Combobox {...defaultProps} allowAddNew={true} onAddNew={jest.fn()} />);
    const input = screen.getByPlaceholderText('Search or enter new value');
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText('Add New...')).toBeInTheDocument();
    });
  });

  it('calls onAddNew when "Add New" is clicked', async () => {
    const onAddNew = jest.fn();
    render(<Combobox {...defaultProps} allowAddNew={true} onAddNew={onAddNew} />);
    const input = screen.getByPlaceholderText('Search or enter new value');
    fireEvent.focus(input);

    await waitFor(() => {
      fireEvent.click(screen.getByText('Add New...'));
    });

    expect(onAddNew).toHaveBeenCalled();
  });

  it('does not display "Add New" option when allowAddNew is false', async () => {
    render(<Combobox {...defaultProps} allowAddNew={false} />);
    const input = screen.getByPlaceholderText('Search or enter new value');
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.queryByText('Add New...')).not.toBeInTheDocument();
    });
  });

  it('closes the options list when Escape is pressed', async () => {
    render(<Combobox {...defaultProps} />);
    const input = screen.getByPlaceholderText('Search or enter new value');
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });
});
