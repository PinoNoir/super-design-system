import { render, screen } from '@testing-library/react';

import FormFooter from '../FormFooter';

describe('FormFooter Component', () => {
  it('renders children correctly', () => {
    render(
      <FormFooter>
        <button>Save</button>
        <button>Cancel</button>
      </FormFooter>,
    );

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <FormFooter className="custom-class">
        <button>Action</button>
      </FormFooter>,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
