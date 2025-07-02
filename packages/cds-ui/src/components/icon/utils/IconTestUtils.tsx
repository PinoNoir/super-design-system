import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Generic test factory for icon components
export function createIconTests(IconComponent, componentName) {
  describe(`${componentName} Icon`, () => {
    test('renders without crashing', () => {
      render(<IconComponent />);
      const svgElement = document.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
    });

    test('passes className prop correctly', () => {
      render(<IconComponent className="test-class" />);
      const svgElement = document.querySelector('svg');
      expect(svgElement).toHaveClass('test-class');
    });

    test('passes other props correctly', () => {
      render(<IconComponent data-testid="test-id" aria-label="test-label" />);
      const svgElement = document.querySelector('svg');
      expect(svgElement).toHaveAttribute('data-testid', 'test-id');
      expect(svgElement).toHaveAttribute('aria-label', 'test-label');
    });

    test('has correct viewBox', () => {
      render(<IconComponent />);
      const svgElement = document.querySelector('svg');
      expect(svgElement).toHaveAttribute('viewBox');
    });

    test('contains at least one path or shape element', () => {
      render(<IconComponent />);
      // Check for common SVG elements
      const shapeElements = document.querySelectorAll('path, circle, rect, polygon, ellipse, line');
      expect(shapeElements.length).toBeGreaterThan(0);
    });
  });
}
