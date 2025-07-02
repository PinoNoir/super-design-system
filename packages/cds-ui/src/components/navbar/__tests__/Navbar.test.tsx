import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar, { NavbarProps } from '../Navbar';

// Mock the CSS module
jest.mock('./styles/Navbar.module.css', () => ({
  nav: 'mock-nav-class',
  navLogo: 'mock-nav-logo-class',
  navLinks: 'mock-nav-links-class',
  additionalContentContainer: 'mock-additional-content-container-class',
}));

describe('Navbar Component', () => {
  const defaultProps: NavbarProps = {
    logoLinkUrl: '/home',
    logoLinkTitle: 'Go to Home',
    logoSrc: 'logo.png',
    logoAlt: 'Test Logo',
    links: [
      { label: 'About', url: '/about' },
      { label: 'Products', url: '/products' },
      { label: 'Contact', url: '/contact', target: '_blank' },
    ],
  };

  it('renders with default props', () => {
    render(<Navbar {...defaultProps} />);

    // Check if the logo is rendered
    const logoLink = screen.getByTitle('Go to Home');
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/home');

    const logoImg = screen.getByAltText('Test Logo');
    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute('src', 'logo.png');

    // Check if links are rendered
    const aboutLink = screen.getByText('About');
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/about');

    const productsLink = screen.getByText('Products');
    expect(productsLink).toBeInTheDocument();

    const contactLink = screen.getByText('Contact');
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute('target', '_blank');
  });

  it('renders with custom logo component', () => {
    const customLogo = <div automation-id="custom-logo">Custom Logo</div>;
    render(
      <Navbar
        {...defaultProps}
        logo={customLogo}
        logoSrc="ignored-logo.png" // This should be ignored
      />,
    );

    // Custom logo should be rendered instead of the image
    expect(screen.queryByAltText('Test Logo')).not.toBeInTheDocument();
    expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
  });

  it('renders with custom link components', () => {
    const customLinks = (
      <>
        <li automation-id="custom-link-1">
          <a href="/custom1">Custom 1</a>
        </li>
        <li automation-id="custom-link-2">
          <a href="/custom2">Custom 2</a>
        </li>
      </>
    );

    render(<Navbar {...defaultProps} linkComponents={customLinks} />);

    // The default links should not be rendered
    expect(screen.queryByText('About')).not.toBeInTheDocument();

    // Custom links should be rendered
    expect(screen.getByTestId('custom-link-1')).toBeInTheDocument();
    expect(screen.getByTestId('custom-link-2')).toBeInTheDocument();
  });

  it('renders children when username is provided', () => {
    render(
      <Navbar {...defaultProps} username="testuser">
        <div automation-id="child-element">Child Content</div>
      </Navbar>,
    );

    // The child element should be rendered
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
  });

  it('does not render children when username is not provided', () => {
    render(
      <Navbar {...defaultProps}>
        <div automation-id="child-element">Child Content</div>
      </Navbar>,
    );

    // The child element should not be rendered
    expect(screen.queryByTestId('child-element')).not.toBeInTheDocument();
  });

  it('uses div as wrapper component when specified', () => {
    const { container } = render(<Navbar {...defaultProps} wrapperComponent="div" />);

    // Check if div is used as wrapper instead of header
    const wrapperDiv = container.querySelector('div');
    expect(wrapperDiv).toBeInTheDocument();
    expect(wrapperDiv?.firstChild?.nodeName).toBe('NAV');
  });

  it('uses header as default wrapper component', () => {
    const { container } = render(<Navbar {...defaultProps} />);

    // Check if header is used as wrapper by default
    const wrapperHeader = container.querySelector('header');
    expect(wrapperHeader).toBeInTheDocument();
    expect(wrapperHeader?.firstChild?.nodeName).toBe('NAV');
  });

  it('passes automation-id to the nav element', () => {
    render(<Navbar {...defaultProps} automation-id="test-navbar" />);

    const navElement = screen.getByRole('navigation');
    expect(navElement).toHaveAttribute('automation-id', 'test-navbar');
  });

  it('applies custom id when provided', () => {
    render(<Navbar {...defaultProps} id="custom-nav-id" />);

    const navElement = screen.getByRole('navigation');
    expect(navElement).toHaveAttribute('id', 'custom-nav-id');
  });

  it('does not render logo section when logoSrc and logo are not provided', () => {
    const propsWithoutLogo = {
      logoLinkUrl: '/home',
      links: defaultProps.links,
    };

    render(<Navbar {...propsWithoutLogo} />);

    // Logo link should not be in the document
    const logoLinks = document.querySelectorAll('a.mock-nav-logo-class');
    expect(logoLinks.length).toBe(0);
  });
});
