import React from 'react';
import { render, screen } from '@testing-library/react';

import Box from '../Box';

// Mock the design token mappings
jest.mock('../utils/constants.ts', () => ({
  DESIGN_TOKEN_MAPPINGS: {
    color: {
      'teal-60': 'var(--color-teal-60)',
      'neutral-100': 'var(--color-neutral-100)',
      white: 'var(--color-white)',
      'red-50': 'var(--color-red-50)',
    },
    space: {
      '0': 'var(--space-0)',
      '8': 'var(--space-8)',
      '16': 'var(--space-16)',
      '24': 'var(--space-24)',
      '32': 'var(--space-32)',
    },
    size: {
      '16': 'var(--size-16)',
      '32': 'var(--size-32)',
      '64': 'var(--size-64)',
    },
    borderRadius: {
      '0': 'var(--border-radius-0)',
      '4': 'var(--border-radius-4)',
      '8': 'var(--border-radius-8)',
      round: 'var(--border-radius-round)',
    },
    shadow: {
      'bottom-2': 'var(--shadow-bottom-2)',
      'bottom-4': 'var(--shadow-bottom-4)',
    },
    fontSize: {
      body: 'var(--font-size-body)',
      h1: 'var(--font-size-h1)',
      h2: 'var(--font-size-h2)',
    },
    zIndex: {
      modal: 'var(--z-index-modal)',
      toast: 'var(--z-index-toast)',
    },
  },
}));

describe('Box Component', () => {
  describe('Basic Rendering', () => {
    it('renders a div by default', () => {
      render(<Box automation-id="box">Content</Box>);
      const box = screen.getByTestId('box');

      expect(box).toBeInTheDocument();
      expect(box.tagName).toBe('DIV');
      expect(box).toHaveTextContent('Content');
    });

    it('renders different HTML elements using the "as" prop', () => {
      render(
        <Box as="section" automation-id="section-box">
          Section content
        </Box>,
      );
      const box = screen.getByTestId('section-box');

      expect(box.tagName).toBe('SECTION');
      expect(box).toHaveTextContent('Section content');
    });

    it('renders children correctly', () => {
      render(
        <Box automation-id="parent-box">
          <span>Child 1</span>
          <span>Child 2</span>
        </Box>,
      );

      const box = screen.getByTestId('parent-box');
      expect(box).toHaveTextContent('Child 1Child 2');
    });

    it('forwards refs correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Box ref={ref} automation-id="ref-box">
          Content
        </Box>,
      );

      expect(ref.current).toBe(screen.getByTestId('ref-box'));
    });
  });

  describe('Design Token Integration', () => {
    it('applies color design tokens correctly', () => {
      render(
        <Box bg="teal-60" color="white" borderColor="red-50" automation-id="color-box">
          Content
        </Box>,
      );

      const box = screen.getByTestId('color-box');
      expect(box).toHaveStyle({
        backgroundColor: 'var(--color-teal-60)',
        color: 'var(--color-white)',
        borderColor: 'var(--color-red-50)',
      });
    });

    it('applies spacing design tokens correctly', () => {
      render(
        <Box p="16" m="24" px="8" my="32" gap="16" automation-id="spacing-box">
          Content
        </Box>,
      );

      const box = screen.getByTestId('spacing-box');
      expect(box).toHaveStyle({
        padding: 'var(--space-16)',
        margin: 'var(--space-24)',
        paddingInline: 'var(--space-8)',
        marginBlock: 'var(--space-32)',
        gap: 'var(--space-16)',
      });
    });

    it('applies size design tokens correctly', () => {
      render(
        <Box w="64" h="32" minW="16" maxH="64" automation-id="size-box">
          Content
        </Box>,
      );

      const box = screen.getByTestId('size-box');
      expect(box).toHaveStyle({
        width: 'var(--size-64)',
        height: 'var(--size-32)',
        minWidth: 'var(--size-16)',
        maxHeight: 'var(--size-64)',
      });
    });

    it('applies border radius design tokens correctly', () => {
      render(
        <Box borderRadius="8" automation-id="border-box">
          Content
        </Box>,
      );

      const box = screen.getByTestId('border-box');
      expect(box).toHaveStyle({
        borderRadius: 'var(--border-radius-8)',
      });
    });

    it('applies shadow design tokens correctly', () => {
      render(
        <Box boxShadow="bottom-4" automation-id="shadow-box">
          Content
        </Box>,
      );

      const box = screen.getByTestId('shadow-box');
      expect(box).toHaveStyle({
        boxShadow: 'var(--shadow-bottom-4)',
      });
    });

    it('applies typography design tokens correctly', () => {
      render(
        <Box fontSize="h1" fontWeight="bold" textAlign="center" automation-id="typography-box">
          Content
        </Box>,
      );

      const box = screen.getByTestId('typography-box');
      expect(box).toHaveStyle({
        fontSize: 'var(--font-size-h1)',
        fontWeight: 'var(--font-weight-bold)',
        textAlign: 'center',
      });
    });

    it('applies z-index design tokens correctly', () => {
      render(
        <Box zIndex="modal" automation-id="zindex-box">
          Content
        </Box>,
      );

      const box = screen.getByTestId('zindex-box');
      expect(box).toHaveStyle({
        zIndex: 'var(--z-index-modal)',
      });
    });
  });

  describe('Layout Properties', () => {
    it('applies display properties correctly', () => {
      render(
        <Box display="flex" automation-id="display-box">
          Content
        </Box>,
      );

      const box = screen.getByTestId('display-box');
      expect(box).toHaveStyle({
        display: 'flex',
      });
    });

    it('applies flexbox properties correctly', () => {
      render(
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="stretch"
          flexWrap="wrap"
          automation-id="flex-box"
        >
          Content
        </Box>,
      );

      const box = screen.getByTestId('flex-box');
      expect(box).toHaveStyle({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        flexWrap: 'wrap',
      });
    });

    it('applies position properties correctly', () => {
      render(
        <Box position="absolute" automation-id="position-box">
          Content
        </Box>,
      );

      const box = screen.getByTestId('position-box');
      expect(box).toHaveStyle({
        position: 'absolute',
      });
    });
  });

  describe('Responsive Values', () => {
    it('handles responsive object values (using base value)', () => {
      render(
        <Box
          bg={{ xs: 'white', md: 'teal-60', lg: 'neutral-100' }}
          p={{ sm: '8', lg: '24' }}
          automation-id="responsive-box"
        >
          Content
        </Box>,
      );

      const box = screen.getByTestId('responsive-box');
      // Should use the first defined value (xs for bg, sm for p)
      expect(box).toHaveStyle({
        backgroundColor: 'var(--color-white)',
        padding: 'var(--space-8)',
      });
    });
  });

  describe('HTML Attributes and Props', () => {
    it('passes through standard HTML attributes', () => {
      render(
        <Box
          automation-id="html-attrs-box"
          id="custom-id"
          className="custom-class"
          role="button"
          aria-label="Custom Box"
          onClick={jest.fn()}
        >
          Content
        </Box>,
      );

      const box = screen.getByTestId('html-attrs-box');
      expect(box).toHaveAttribute('id', 'custom-id');
      expect(box).toHaveClass('custom-class');
      expect(box).toHaveAttribute('role', 'button');
      expect(box).toHaveAttribute('aria-label', 'Custom Box');
    });

    it('combines custom className with generated styles', () => {
      render(
        <Box className="my-custom-class" bg="teal-60" automation-id="class-combination-box">
          Content
        </Box>,
      );

      const box = screen.getByTestId('class-combination-box');
      expect(box).toHaveClass('my-custom-class');
      expect(box).toHaveStyle({
        backgroundColor: 'var(--color-teal-60)',
      });
    });

    it('merges style prop with generated styles', () => {
      render(
        <Box bg="white" style={{ border: '1px solid red', fontSize: '20px' }} automation-id="style-merge-box">
          Content
        </Box>,
      );

      const box = screen.getByTestId('style-merge-box');
      expect(box).toHaveStyle({
        backgroundColor: 'var(--color-white)',
        border: '1px solid red',
        fontSize: '20px',
      });
    });
  });

  describe('Component Props Separation', () => {
    it('correctly separates CSS props from HTML props', () => {
      const handleClick = jest.fn();

      render(
        <Box bg="white" p="16" onClick={handleClick} data-custom="test" automation-id="prop-separation-box">
          Content
        </Box>,
      );

      const box = screen.getByTestId('prop-separation-box');

      // CSS props should be in styles
      expect(box).toHaveStyle({
        backgroundColor: 'var(--color-white)',
        padding: 'var(--space-16)',
      });

      // HTML props should be attributes
      expect(box).toHaveAttribute('data-custom', 'test');

      // Event handlers should work
      box.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
