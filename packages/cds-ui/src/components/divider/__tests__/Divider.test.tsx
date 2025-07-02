import { render, screen } from '@testing-library/react';

import Divider from '../Divider';

// Mock the CSS module
jest.mock('../styles/Divider.module.css', () => ({
  divider: 'divider',
  thin: 'thin',
  medium: 'medium',
  thick: 'thick',
  horizontal: 'horizontal',
  vertical: 'vertical',
}));

describe('Divider Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<Divider />);
      expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('renders as a div element with separator role', () => {
      render(<Divider />);
      const divider = screen.getByRole('separator');
      expect(divider.tagName).toBe('DIV');
    });

    it('has correct display name', () => {
      expect(Divider.displayName).toBe('Divider');
    });
  });

  describe('Default Props', () => {
    it('applies default thickness (medium) and orientation (horizontal)', () => {
      render(<Divider />);
      const divider = screen.getByRole('separator');
      expect(divider).toHaveClass('divider', 'medium', 'horizontal');
    });
  });

  describe('Thickness Variants', () => {
    it('applies thin thickness class', () => {
      render(<Divider thickness="thin" />);
      const divider = screen.getByRole('separator');
      expect(divider).toHaveClass('thin');
      expect(divider).not.toHaveClass('medium', 'thick');
    });

    it('applies medium thickness class', () => {
      render(<Divider thickness="medium" />);
      const divider = screen.getByRole('separator');
      expect(divider).toHaveClass('medium');
      expect(divider).not.toHaveClass('thin', 'thick');
    });

    it('applies thick thickness class', () => {
      render(<Divider thickness="thick" />);
      const divider = screen.getByRole('separator');
      expect(divider).toHaveClass('thick');
      expect(divider).not.toHaveClass('thin', 'medium');
    });
  });

  describe('Orientation Variants', () => {
    it('applies horizontal orientation class', () => {
      render(<Divider orientation="horizontal" />);
      const divider = screen.getByRole('separator');
      expect(divider).toHaveClass('horizontal');
      expect(divider).not.toHaveClass('vertical');
    });

    it('applies vertical orientation class', () => {
      render(<Divider orientation="vertical" />);
      const divider = screen.getByRole('separator');
      expect(divider).toHaveClass('vertical');
      expect(divider).not.toHaveClass('horizontal');
    });
  });

  describe('Combined Props', () => {
    it('applies multiple variant classes together', () => {
      render(<Divider thickness="thick" orientation="vertical" />);
      const divider = screen.getByRole('separator');
      expect(divider).toHaveClass('divider', 'thick', 'vertical');
    });

    it('applies all classes including custom className', () => {
      render(<Divider thickness="thin" orientation="horizontal" className="custom-divider extra-class" />);
      const divider = screen.getByRole('separator');
      expect(divider).toHaveClass('divider', 'thin', 'horizontal', 'custom-divider', 'extra-class');
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      render(<Divider className="custom-class" />);
      const divider = screen.getByRole('separator');
      expect(divider).toHaveClass('custom-class');
    });

    it('applies automation-id attribute', () => {
      render(<Divider automation-id="test-divider" />);
      const divider = screen.getByRole('separator');
      expect(divider).toHaveAttribute('automation-id', 'test-divider');
    });

    it('passes through additional HTML attributes', () => {
      render(<Divider data-testid="custom-divider" id="divider-1" title="Content separator" />);
      const divider = screen.getByRole('separator');
      expect(divider).toHaveAttribute('data-testid', 'custom-divider');
      expect(divider).toHaveAttribute('id', 'divider-1');
      expect(divider).toHaveAttribute('title', 'Content separator');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined className gracefully', () => {
      render(<Divider className={undefined} />);
      const divider = screen.getByRole('separator');
      expect(divider).toHaveClass('divider', 'medium', 'horizontal');
    });

    it('handles empty string className', () => {
      render(<Divider className="" />);
      const divider = screen.getByRole('separator');
      expect(divider).toHaveClass('divider', 'medium', 'horizontal');
    });

    it('handles multiple space-separated classNames', () => {
      render(<Divider className="class1 class2 class3" />);
      const divider = screen.getByRole('separator');
      expect(divider).toHaveClass('class1', 'class2', 'class3');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA role', () => {
      render(<Divider />);
      expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('can be found by role and accessible name when aria-label is provided', () => {
      render(<Divider aria-label="Section divider" />);
      expect(screen.getByRole('separator', { name: 'Section divider' })).toBeInTheDocument();
    });

    it('supports aria-orientation attribute', () => {
      render(<Divider aria-orientation="vertical" />);
      const divider = screen.getByRole('separator');
      expect(divider).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  describe('TypeScript Props', () => {
    it('accepts all valid thickness values', () => {
      const thicknesses: Array<'thin' | 'medium' | 'thick'> = ['thin', 'medium', 'thick'];

      thicknesses.forEach((thickness) => {
        const { unmount } = render(<Divider thickness={thickness} />);
        expect(screen.getByRole('separator')).toHaveClass(thickness);
        unmount();
      });
    });

    it('accepts all valid orientation values', () => {
      const orientations: Array<'horizontal' | 'vertical'> = ['horizontal', 'vertical'];

      orientations.forEach((orientation) => {
        const { unmount } = render(<Divider orientation={orientation} />);
        expect(screen.getByRole('separator')).toHaveClass(orientation);
        unmount();
      });
    });
  });
});
