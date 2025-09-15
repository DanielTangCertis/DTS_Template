import React from 'react';
import { Box, styled } from '@mui/material';
import { LayoutBox } from '../components/Layout';

const Page3Container = styled(Box)({
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
});

const Page3: React.FC = () => {
  return (
    <Page3Container>
      <LayoutBox side="left" delay={300}>
        {/* Add your Page 3 left content here */}
      </LayoutBox>
      <LayoutBox side="right" delay={300}>
        {/* Add your Page 3 right content here */}
      </LayoutBox>
    </Page3Container>
  );
};

export default Page3