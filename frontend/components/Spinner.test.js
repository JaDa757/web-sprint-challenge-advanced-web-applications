import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Spinner from './Spinner';

test('renders Spinner with "Please wait..." text', () => {
  render(<Spinner on={true} />);
  const spinnerElement = screen.getByText('Please wait...');
  expect(spinnerElement).toBeInTheDocument();
});

test('does not render Spinner when "on" prop is false', () => {
  render(<Spinner on={false} />);
  const spinnerElement = screen.queryByText('Please wait...');
  expect(spinnerElement).toBeNull();
});
