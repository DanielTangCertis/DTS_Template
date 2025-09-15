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
      <LayoutBox side="left" delay={300}>
        {/* Add your Page 2 left content here */}
      </LayoutBox>
      <LayoutBox side="right" delay={300}>
        {/* Add your Page 2 right content here */}
      </LayoutBox>
    </Page2Container>
  );
};

export default Page2