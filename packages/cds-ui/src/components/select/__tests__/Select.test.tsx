import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Select from '../Select';
import MenuItem from '../MenuItem';

jest.mock('@iconify/react', () => ({
  Icon: () => <span data-testid="mocked-icon" />,
}));

describe('Select', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const renderSelect = (props = {}) => {
    return render(
      <Select onChange={jest.fn()} {...props}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>,
    );
  };

  it('renders with a placeholder', () => {
    renderSelect({ placeholder: 'Select an option' });
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    renderSelect();
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  it('selects an option when clicked', async () => {
    const onChange = jest.fn();
    renderSelect({ onChange, name: 'option1' }); // ✅ Add name here
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      fireEvent.click(screen.getByText('Option 1'));
    });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: { name: 'option1', value: 'option1' } }));
  });

  it('displays selected value', () => {
    renderSelect({ value: 'Option 2' });
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    renderSelect({ label: 'Test Label' });
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('disables the select when disabled prop is true', () => {
    renderSelect({ disabled: true });
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows error message when invalid', () => {
    renderSelect({ invalid: true, invalidText: 'Error message' });
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('handles keyboard navigation', async () => {
    renderSelect();
    const selectButton = screen.getByRole('button');
    fireEvent.keyDown(selectButton, { key: 'Enter' });
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
    fireEvent.keyDown(selectButton, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Select and SelectMenu', () => {
    // ... (keep your existing tests)

    // New tests for SelectMenu functionality
    it('renders all options in the SelectMenu when opened', async () => {
      renderSelect();
      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
        options.forEach((option) => {
          expect(screen.getByText(option.label)).toBeInTheDocument();
        });
      });
    });

    it('closes the SelectMenu when an option is selected', async () => {
      renderSelect();
      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('Option 1'));
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('highlights the selected option in the SelectMenu', async () => {
      renderSelect({ value: 'option2' });
      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        const option2Element = screen.getByText('Option 2');
        expect(option2Element.closest('li')).toHaveAttribute('aria-selected', 'true');
      });
    });

    it('closes the SelectMenu when clicking outside', async () => {
      render(
        <div>
          <div automation-id="outside">Outside</div>
          <Select onChange={jest.fn()}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </div>,
      );

      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      fireEvent.mouseDown(screen.getByTestId('outside'));
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('updates the SelectMenu width when the Select button width changes', async () => {
      const { rerender } = renderSelect();
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const initialWidth = screen.getByRole('listbox').style.width;

      // Simulate a change in the Select button's width
      Object.defineProperty(screen.getByRole('button'), 'getBoundingClientRect', {
        value: () => ({ top: 0, left: 0, bottom: 20, right: 200, width: 200, height: 20 }),
        configurable: true,
      });

      // Force a re-render
      rerender(
        <Select onChange={jest.fn()}>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>,
      );

      // Trigger a window resize to update the menu width
      fireEvent(window, new Event('resize'));

      // Add a small delay to allow for the animation frame to complete
      await new Promise((resolve) => setTimeout(resolve, 50));

      await waitFor(() => {
        const newWidth = screen.getByRole('listbox').style.width;
        expect(newWidth).toBe('200px');
        expect(newWidth).not.toBe(initialWidth);
      });
    });
  });
});
