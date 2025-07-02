import { render, screen } from '@testing-library/react';

import Footer from '../Footer';

// Mock the @iconify/react module
jest.mock('@iconify/react', () => ({
  Icon: ({ icon }) => <div automation-id={`mock-icon-${icon}`} />,
}));

// Mock the Stack component
jest.mock('../../stack', () => ({
  Stack: ({ children }) => <div automation-id="mock-stack">{children}</div>,
}));

describe('Footer Component', () => {
  const mockLinks = [
    { label: 'Link 1', url: 'https://example1.com' },
    { label: 'Link 2', url: 'https://example2.com', target: '_blank' },
  ];
  const mockSupportPhone = '1-800-123-4567';

  const renderFooter = (props = {}) => {
    return render(<Footer links={mockLinks} supportPhone={mockSupportPhone} {...props} />);
  };

  it('renders footer with correct content', () => {
    renderFooter();
    expect(screen.getByText(`Need assistance? We'd love to help.`)).toBeInTheDocument();
    expect(screen.getByText(`Contact Support at ${mockSupportPhone}`)).toBeInTheDocument();
    expect(screen.getByText(/© \d{4} SDS\. All rights reserved\./)).toBeInTheDocument();
  });

  it('renders all provided links', () => {
    renderFooter();
    mockLinks.forEach((link) => {
      const linkElement = screen.getByText(link.label);
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', link.url);
      if (link.target) {
        expect(linkElement).toHaveAttribute('target', link.target);
      }
    });
  });

  it('renders social media links', () => {
    renderFooter();
    expect(screen.getByTestId('mock-icon-mdi:twitter')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon-mdi:linkedin')).toBeInTheDocument();
  });

  it('applies custom background color and border', () => {
    const backgroundColor = 'red';
    const borderTop = '1px solid black';
    renderFooter({ backgroundColor, borderTop });
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveStyle(`background-color: ${backgroundColor}`);
    expect(footer).toHaveStyle(`border-top: ${borderTop}`);
  });

  it('passes through additional props', () => {
    renderFooter({ 'automation-id': 'footer' });
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders the current year in the copyright notice', () => {
    const currentYear = new Date().getFullYear();
    renderFooter();
    expect(screen.getByText(`© ${currentYear} SDS. All rights reserved.`)).toBeInTheDocument();
  });
});
