import { render, screen } from '@testing-library/react';
import Breadcrumb from '../Breadcrumb';
import BreadcrumbItem from '../BreadcrumbItem';

describe('Breadcrumb', () => {
  test('renders breadcrumb items correctly', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Electronics</BreadcrumbItem>
      </Breadcrumb>,
    );

    const homeLink = screen.getByRole('link', { name: 'Home' });
    const productsLink = screen.getByRole('link', { name: 'Products' });
    const electronicsText = screen.getByText('Electronics');

    expect(homeLink).toHaveAttribute('href', '/');
    expect(productsLink).toHaveAttribute('href', '/products');
    expect(electronicsText).toBeInTheDocument();
    expect(electronicsText.tagName).toBe('SPAN');
  });

  test('applies current class to the last breadcrumb item', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Electronics</BreadcrumbItem>
      </Breadcrumb>,
    );

    const electronicsItem = screen.getByText('Electronics').closest('li');

    expect(electronicsItem).toHaveClass('breadcrumbItem current');
  });

  test('renders only the home breadcrumb when on the home page', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem isCurrentPage>Home</BreadcrumbItem>
      </Breadcrumb>,
    );

    const homeText = screen.getByText('Home');

    expect(homeText).toBeInTheDocument();
    expect(homeText.tagName).toBe('SPAN');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  test('renders correctly with custom className', () => {
    render(
      <Breadcrumb className="custom-breadcrumb">
        <BreadcrumbItem href="/" className="custom-item">
          Home
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage className="custom-current">
          Products
        </BreadcrumbItem>
      </Breadcrumb>,
    );

    const breadcrumb = screen.getByRole('navigation');
    const homeItem = screen.getByText('Home').closest('li');
    const productsItem = screen.getByText('Products').closest('li');

    expect(breadcrumb).toHaveClass('custom-breadcrumb');
    expect(homeItem).toHaveClass('custom-item');
    expect(productsItem).toHaveClass('custom-current');
  });
});
