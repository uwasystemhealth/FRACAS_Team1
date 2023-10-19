import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Import jest-dom for custom matchers
import HomePage from '../pages/HomePage'; // Adjust the import path as needed


it('renders "What We Do" heading', () => {
    render(<HomePage />);
    const headingElement = screen.getByText('What We Do');
    expect(headingElement).toBeInTheDocument();
  });
  
