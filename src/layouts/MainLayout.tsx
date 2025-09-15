import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../components/Header/Header';
import Player from '../components/Player/Player';
import RouterNav from '../components/RouterNav/RouterNav';
import LayerTree from '../components/LayerTree/LayerTree';
import Animation from '../components/Animation/Animation';
import Weather from '../components/Weather/Weather';
import { useHeader } from '../contexts/HeaderContext';

const MainLayout: React.FC = () => {
  const { state } = useHeader();

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Player />
      <Header />
      {state.showLayerTree && <LayerTree />}
      {state.showAnimation && <Animation />}
      {state.showWeather && <Weather />}
      <Outlet />
      <RouterNav />
    </Box>
  );
};

export default MainLayout;