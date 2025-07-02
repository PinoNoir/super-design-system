import { render, screen } from '@testing-library/react';
import Card from './Card';

// Mock all used CSS module classes
jest.mock('./styles/Card.module.css', () => ({
  card: 'card',
  default: 'default',
  bordered: 'bordered',
  cardLoading: 'cardLoading',
  loadingOverlay: 'loadingOverlay',
  cardTitle: 'cardTitle',
  cardContent: 'cardContent',
  cardFooter: 'cardFooter',
  footerStart: 'footerStart',
  footerCenter: 'footerCenter',
  footerEnd: 'footerEnd',
}));

// Mock the Loader component
jest.mock('../loader', () => ({
  Loader: () => <div automation-id="loader">Loading...</div>,
}));

describe('Card Component', () => {
  describe('Main Card', () => {
    it('renders children correctly', () => {
      render(
        <Card>
          <div>Test Content</div>
        </Card>,
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies default variant class', () => {
      const { container } = render(
        <Card>
          <div>Content</div>
        </Card>,
      );
      expect(container.firstChild).toHaveClass('card');
    });

    it('applies bordered variant class when specified', () => {
      const { container } = render(
        <Card variant="bordered">
          <div>Content</div>
        </Card>,
      );

      expect(container.firstChild).toHaveClass('card', 'bordered');
    });

    it('shows loading overlay when isLoading is true', () => {
      render(
        <Card isLoading>
          <div>Content</div>
        </Card>,
      );

      expect(screen.getByTestId('loader')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('applies loading classes when isLoading is true', () => {
      const { container } = render(
        <Card isLoading>
          <div>Content</div>
        </Card>,
      );

      expect(container.firstChild).toHaveClass('cardLoading');
      expect(container.querySelector('div[automation-id="loader"]')?.parentElement).toHaveClass('loadingOverlay');
    });

    it('applies custom className', () => {
      const { container } = render(
        <Card className="custom-class">
          <div>Content</div>
        </Card>,
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Card.Title', () => {
    it('renders title text correctly', () => {
      render(<Card.Title>Card Title</Card.Title>);

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card Title').tagName).toBe('H3');
    });

    it('applies cardTitle class', () => {
      render(<Card.Title>Card Title</Card.Title>);
      expect(screen.getByText('Card Title')).toHaveClass('cardTitle');
    });

    it('applies custom className to title', () => {
      render(<Card.Title className="custom-title">Card Title</Card.Title>);
      expect(screen.getByText('Card Title')).toHaveClass('custom-title');
    });
  });

  describe('Card.Content', () => {
    it('renders content correctly', () => {
      render(
        <Card.Content>
          <div>Card Content</div>
        </Card.Content>,
      );

      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('applies cardContent class', () => {
      const { container } = render(
        <Card.Content>
          <div>Content</div>
        </Card.Content>,
      );
      expect(container.firstChild).toHaveClass('cardContent');
    });

    const createSuspensePromise = () => new Promise(() => {}); // This creates a suspended state

    it('shows fallback loader during suspense', () => {
      const createSuspendedState = () => {
        throw createSuspensePromise();
      };

      const SuspendedComponent = () => {
        createSuspendedState();
        return null;
      };

      render(
        <Card.Content>
          <SuspendedComponent />
        </Card.Content>,
      );

      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('applies custom className to content', () => {
      const { container } = render(
        <Card.Content className="custom-content">
          <div>Content</div>
        </Card.Content>,
      );

      expect(container.firstChild).toHaveClass('custom-content');
    });
  });

  describe('Card.Footer', () => {
    it('renders footer content correctly', () => {
      render(
        <Card.Footer>
          <div>Footer Content</div>
        </Card.Footer>,
      );

      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });

    it('applies alignment classes correctly', () => {
      const { container: startContainer } = render(<Card.Footer align="start">Content</Card.Footer>);
      expect(startContainer.firstChild).toHaveClass('cardFooter', 'footerStart');

      const { container: centerContainer } = render(<Card.Footer align="center">Content</Card.Footer>);
      expect(centerContainer.firstChild).toHaveClass('cardFooter', 'footerCenter');

      const { container: endContainer } = render(<Card.Footer align="end">Content</Card.Footer>);
      expect(endContainer.firstChild).toHaveClass('cardFooter', 'footerEnd');
    });

    it('applies custom className to footer', () => {
      const { container } = render(
        <Card.Footer className="custom-footer">
          <div>Footer</div>
        </Card.Footer>,
      );

      expect(container.firstChild).toHaveClass('custom-footer');
    });
  });

  describe('Integration', () => {
    it('renders complete card with all subcomponents', () => {
      render(
        <Card>
          <Card.Title>Test Title</Card.Title>
          <Card.Content>Test Content</Card.Content>
          <Card.Footer>Test Footer</Card.Footer>
        </Card>,
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(screen.getByText('Test Footer')).toBeInTheDocument();
    });
  });
});
