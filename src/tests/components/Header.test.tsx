import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { HeaderProvider } from '../../contexts/HeaderContext';
import Header from '../../components/Header/Header';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider theme={darkTheme}>
      <HeaderProvider>
        {children}
      </HeaderProvider>
    </ThemeProvider>
  </BrowserRouter>
);

describe('Header Component', () => {
  it('renders logo and navigation elements', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    expect(screen.getByAltText('logo')).toBeInTheDocument();
    expect(screen.getByTitle('Layer Tree')).toBeInTheDocument();
    expect(screen.getByTitle('Animated Tours')).toBeInTheDocument();
    expect(screen.getByTitle('Weather')).toBeInTheDocument();
  });

  it('toggles layer tree visibility when clicked', () => {
    const onLayerTreeToggle = jest.fn();
    
    render(
      <TestWrapper>
        <Header onLayerTreeToggle={onLayerTreeToggle} />
      </TestWrapper>
    );

    const layerTreeButton = screen.getByTitle('Layer Tree');
    fireEvent.click(layerTreeButton);
    
    expect(onLayerTreeToggle).toHaveBeenCalledTimes(1);
  });

  it('displays current time', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    // Should display time in HH:mm:ss format
    const timeElement = screen.getByText(/\d{2}:\d{2}:\d{2}/);
    expect(timeElement).toBeInTheDocument();
  });
});