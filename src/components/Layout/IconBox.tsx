import React from 'react';
import { Box, styled } from '@mui/material';

const IconBoxContainer = styled(Box)<{ width?: number; height?: number }>(({ width = 30, height = 30 }) => ({
  width: `${width}px`,
  height: `${height}px`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  
  '& img': {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  }
}));

interface IconBoxProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  className?: string;
}

export const IconBox: React.FC<IconBoxProps> = ({ 
  children, 
  width = 30, 
  height = 30,
  className 
}) => {
  return (
    <IconBoxContainer width={width} height={height} className={className}>
      {children}
    </IconBoxContainer>
  );
};