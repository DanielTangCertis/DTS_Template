import React from 'react';
import { Box, styled } from '@mui/material';
import { LayoutBox } from '../components/Layout';

const NotFoundPageContainer = styled(Box)({
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  fontSize: '3rem',
});

const NotFound: React.FC = () => {
  return (
    <NotFoundPageContainer>
      <LayoutBox>404 Not Found</LayoutBox>
    </NotFoundPageContainer>
  );
};

export default NotFound