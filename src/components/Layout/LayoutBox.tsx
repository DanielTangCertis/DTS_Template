import React from 'react';
import { Box, Fade, styled } from '@mui/material';
import { useDigitalTwin } from '../../contexts/DigitalTwinContext';

const LeftBoxContainer = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
  position: 'absolute',
  width: '480px',
  height: '100%',
  top: 0,
  left: 0,
  zIndex: 9,
  backgroundImage: 'url("/src/assets/基础/left_bg_dark@2x.png")',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
  padding: '80px 0 40px 24px',
  boxSizing: 'border-box',
  animationDelay: `${delay}s`,
}));

const RightBoxContainer = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
  position: 'absolute',
  width: '480px',
  height: '100%',
  top: 0,
  right: 0,
  zIndex: 9,
  backgroundImage: 'url("/src/assets/基础/right_bg_dark@2x.png")',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
  padding: '80px 20px 40px 30px',
  boxSizing: 'border-box',
  animationDelay: `${delay}s`,
}));

const ContentBox = styled(Box)({
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  position: 'relative',
});

interface LayoutBoxProps {
  children: React.ReactNode;
  side: 'left' | 'right';
  delay?: number;
}

export const LayoutBox: React.FC<LayoutBoxProps> = ({ 
  children, 
  side, 
  delay = 0 
}) => {
  const { state: digitalTwinState } = useDigitalTwin();

  if (!digitalTwinState.playerIsReady) {
    return null;
  }

  const Container = side === 'left' ? LeftBoxContainer : RightBoxContainer;
  const enterClass = side === 'left' ? 'animate__fadeInLeft' : 'animate__fadeInRight';
  const exitClass = side === 'left' ? 'animate__fadeOutLeft' : 'animate__fadeOutRight';

  return (
    <Fade
      in={digitalTwinState.playerIsReady}
      timeout={800}
      style={{
        transitionDelay: `${delay * 1000}ms`,
      }}
    >
      <Container delay={delay}>
        <ContentBox>
          {children}
        </ContentBox>
      </Container>
    </Fade>
  );
};