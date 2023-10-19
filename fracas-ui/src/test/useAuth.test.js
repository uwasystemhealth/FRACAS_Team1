import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../components/useAuth';
import '@testing-library/jest-dom/extend-expect';


// Mock component to utilize useAuth hook
function MockComponent() {
  const auth = useAuth();

  return (
    <div>
      {auth.isAuthenticated ? <span>Authenticated</span> : <span>Not Authenticated</span>}
      <button onClick={() => auth.authenticate('test-token')}>Authenticate</button>
      <button onClick={auth.signout}>Sign Out</button>
    </div>
  );
}

describe('useAuth', () => {
  
  afterEach(() => {
    localStorage.clear();
  });

  test('initially not authenticated', () => {
    render(<AuthProvider><MockComponent /></AuthProvider>);
    expect(screen.getByText('Not Authenticated')).toBeInTheDocument();
  });

  test('authenticates and stores token', () => {
    render(<AuthProvider><MockComponent /></AuthProvider>);

    act(() => {
      screen.getByText('Authenticate').click();
    });

    expect(localStorage.getItem('token')).toBe('test-token');
    expect(screen.getByText('Authenticated')).toBeInTheDocument();
  });

  test('signs out and removes token', () => {
    localStorage.setItem('token', 'test-token');
    
    render(<AuthProvider><MockComponent /></AuthProvider>);

    expect(screen.getByText('Authenticated')).toBeInTheDocument();

    act(() => {
      screen.getByText('Sign Out').click();
    });

    expect(localStorage.getItem('token')).toBeNull();
    expect(screen.getByText('Not Authenticated')).toBeInTheDocument();
  });

});
