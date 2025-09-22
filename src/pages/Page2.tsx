import React from 'react';
import { Box, styled } from '@mui/material';
import { LayoutBox } from '../components/Layout';

const Page2Container = styled(Box)({
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
});

const Page2: React.FC = () => {
  return (
    <Page2Container>
      <LayoutBox side="left" delay={0.3}>
        <Box>Content</Box>
      </LayoutBox>
      <LayoutBox side="right" delay={0.3}>
        <Box>Content</Box>
      </LayoutBox>
    </Page2Container>
  );
};

export default Page2