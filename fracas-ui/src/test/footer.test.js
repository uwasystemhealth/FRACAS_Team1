import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Footer from '../components/Footer';

describe('<Footer />', () => {

  test('renders without crashing', () => {
    render(<Footer />);
    expect(screen.getByText('© UWA Motorsport 2023. All Rights Reserved.')).toBeInTheDocument();
  });
    

  test('has the correct number of links', () => {
    render(<Footer />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);
  });

  test('has correct href attributes for links', () => {
    render(<Footer />);
    expect(screen.getByText('Our Team')).toHaveAttribute('href', 'https://uwam.team/contact-us.html');
    expect(screen.getByText('Our Cars')).toHaveAttribute('href', 'https://uwam.team/');
    expect(screen.getByText('Licenses')).toHaveAttribute('href', 'https://github.com/uwasystemhealth/FRACAS_Team1/blob/main/LICENSE');
    expect(screen.getByText('About Us')).toHaveAttribute('href', 'https://uwam.team/about-us.html');
  });

  test('displays the email information', () => {
    render(<Footer />);
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('motorsport@uwa.edu.au.')).toBeInTheDocument();
  });

  test('displays the correct copyright text', () => {
    render(<Footer />);
    expect(screen.getByText('© UWA Motorsport 2023. All Rights Reserved.')).toBeInTheDocument();
  });
});
