import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Tooltip,
  Typography,
  Fade,
  styled,
} from '@mui/material';
import {
  Layers as LayersIcon,
  Movie as MovieIcon,
  WbSunny as WeatherIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useHeader } from '../../contexts/HeaderContext';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(0, 0, 0, 0.541)',
  backdropFilter: 'blur(10px)',
  position: 'relative',
  zIndex: 10,
  marginBottom: '-64px',
}));

const LogoContainer = styled(Box)({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const LogoImage = styled('img')({
  width: '150px',
  marginRight: '10px',
});

const ToolContainer = styled(Box)({
  position: 'absolute',
  right: '120px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const TimeContainer = styled(Box)({
  position: 'absolute',
  right: '20px',
  color: 'rgba(255, 255, 255, 0.8)',
  fontSize: '16px',
  fontFamily: 'SJyunhei, serif',
});

const FloatingToggle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '17px',
  right: '138px',
  zIndex: 999,
  pointerEvents: 'auto',
  opacity: 0.4,
  transition: 'opacity 0.3s',
  '&:hover': {
    opacity: 1,
  },
}));

interface HeaderProps {
  // Assuming fdapi is passed as a prop or available globally
  onLayerTreeToggle?: () => void;
  onAnimationToggle?: () => void;
  onWeatherToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onLayerTreeToggle,
  onAnimationToggle,
  onWeatherToggle,
}) => {
  const { state, dispatch } = useHeader();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(dayjs().format('HH:mm:ss'));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLayerTreeToggle = () => {
    const newValue = !state.showLayerTree;
    dispatch({ type: 'SET_SHOW_LAYER_TREE', payload: newValue });
    dispatch({ type: 'SET_SHOW_WEATHER', payload: false });
    dispatch({ type: 'SET_SHOW_ANIMATION', payload: false });
    onLayerTreeToggle?.();
  };

  const handleAnimationToggle = () => {
    const newValue = !state.showAnimation;
    dispatch({ type: 'SET_SHOW_ANIMATION', payload: newValue });
    dispatch({ type: 'SET_SHOW_LAYER_TREE', payload: false });
    dispatch({ type: 'SET_SHOW_WEATHER', payload: false });
    onAnimationToggle?.();
  };

  const handleWeatherToggle = () => {
    const newValue = !state.showWeather;
    dispatch({ type: 'SET_SHOW_WEATHER', payload: newValue });
    dispatch({ type: 'SET_SHOW_LAYER_TREE', payload: false });
    dispatch({ type: 'SET_SHOW_ANIMATION', payload: false });
    onWeatherToggle?.();
  };

  const handleUIToggle = () => {
    const newValue = !state.showUI;
    dispatch({ type: 'SET_SHOW_UI', payload: newValue });
    
    // Assuming fdapi is available globally or passed as prop
    if ((window as any).fdapi) {
      (window as any).fdapi.settings.setMainUIVisibility(!newValue);
    }
  };

  return (
    <>
      <Fade in={state.showUI}>
        <StyledAppBar position="static" elevation={0}>
          <Toolbar sx={{ height: '60px', minHeight: '60px !important' }}>
            <LogoContainer>
              <LogoImage
                src="/assets/certis_logo/certis-logo-white.png"
                alt="logo"
              />
            </LogoContainer>

            <ToolContainer>
              <Tooltip title="Layer Tree" placement="bottom">
                <IconButton
                  onClick={handleLayerTreeToggle}
                  sx={{
                    color: state.showLayerTree ? '#7afafe' : '#fff',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.2)',
                    },
                  }}
                >
                  <LayersIcon fontSize="large" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Animated Tours" placement="bottom">
                <IconButton
                  onClick={handleAnimationToggle}
                  sx={{
                    color: state.showAnimation ? '#7afafe' : '#fff',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.2)',
                    },
                  }}
                >
                  <MovieIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Weather" placement="bottom">
                <IconButton
                  onClick={handleWeatherToggle}
                  sx={{
                    color: state.showWeather ? '#7afafe' : '#fff',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.2)',
                    },
                  }}
                >
                  <WeatherIcon fontSize="large" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Toggle HUD" placement="bottom">
                <IconButton
                  onClick={handleUIToggle}
                  sx={{
                    color: state.showUI ? '#7afafe' : '#fff',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.2)',
                    },
                  }}
                >
                  {state.showUI ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </Tooltip>
            </ToolContainer>

            <TimeContainer>
              <Typography variant="body1">{currentTime}</Typography>
            </TimeContainer>
          </Toolbar>
        </StyledAppBar>
      </Fade>

      <Fade in={!state.showUI}>
        <FloatingToggle>
          <Tooltip title="Toggle HUD" placement="bottom">
            <IconButton
              onClick={handleUIToggle}
              sx={{ color: '#fff' }}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        </FloatingToggle>
      </Fade>
    </>
  );
};

export default Header;