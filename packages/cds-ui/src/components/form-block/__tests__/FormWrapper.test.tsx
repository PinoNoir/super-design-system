import React from 'react';
import { render, screen } from '@testing-library/react';
import FormWrapper from '../FormWrapper';
import './styles/FormBlock.module.css';

// Mock the CSS module
jest.mock('./styles/FormBlock.module.css', () => ({
  formWrapper: 'formWrapper-class',
  wrapperVariantsBase: 'wrapperVariants-base-class',
  wrapperVariantsPanel: 'wrapperVariants-panel-class',
}));

describe('FormWrapper', () => {
  it('renders children correctly', () => {
    render(
      <FormWrapper>
        <div automation-id="child-element">Child Content</div>
      </FormWrapper>,
    );

    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('applies default base variant class when no variant is provided', () => {
    render(
      <FormWrapper>
        <div>Content</div>
      </FormWrapper>,
    );

    const wrapperElement = screen.getByText('Content').parentElement;
    expect(wrapperElement).toHaveClass('formWrapper-class');
    expect(wrapperElement).toHaveClass('wrapperVariants-base-class');
  });

  it('applies panel variant class when panel variant is provided', () => {
    render(
      <FormWrapper variant="panel">
        <div>Content</div>
      </FormWrapper>,
    );

    const wrapperElement = screen.getByText('Content').parentElement;
    expect(wrapperElement).toHaveClass('formWrapper-class');
    expect(wrapperElement).toHaveClass('wrapperVariants-panel-class');
  });

  it('applies additional className when provided', () => {
    render(
      <FormWrapper className="custom-class">
        <div>Content</div>
      </FormWrapper>,
    );

    const wrapperElement = screen.getByText('Content').parentElement;
    expect(wrapperElement).toHaveClass('custom-class');
  });

  it('passes additional props to the div element', () => {
    const testId = 'test-wrapper';

    render(
      <FormWrapper automation-id={testId}>
        <div>Content</div>
      </FormWrapper>,
    );

    const wrapperElement = screen.getByTestId(testId);
    expect(wrapperElement).toHaveAttribute('automation-id', testId);
  });

  it('combines all classes correctly', () => {
    render(
      <FormWrapper variant="panel" className="extra-class" automation-id="wrapper">
        <div>Content</div>
      </FormWrapper>,
    );

    const wrapperElement = screen.getByTestId('wrapper');
    expect(wrapperElement).toHaveClass('formWrapper-class');
    expect(wrapperElement).toHaveClass('wrapperVariants-panel-class');
    expect(wrapperElement).toHaveClass('extra-class');
  });
});
