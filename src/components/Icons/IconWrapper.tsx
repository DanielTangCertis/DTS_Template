import React from 'react';
import { Box, SvgIcon, styled } from '@mui/material';

// Import MUI icons as alternatives to custom SVG icons
import {
  Layers as TucengshuIcon,
  ViewInAr as XunimanYouIcon,
  WbSunny as QixiangJianceIcon,
  Visibility as TianKongHeIcon,
  // Add more icons as needed
} from '@mui/icons-material';

const IconContainer = styled(Box)<{ fontSize?: number; color?: string }>(({ fontSize, color, theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: fontSize ? `${fontSize}px` : '16px',
  color: color || theme.palette.text.primary,
  transition: 'color 0.3s ease',
  cursor: 'pointer',
  
  '& svg': {
    width: '1em',
    height: '1em',
    verticalAlign: '-0.15em',
    fill: 'currentColor',
    overflow: 'hidden',
  }
}));

interface IconWrapperProps {
  icon: string;
  fontSize?: number;
  color?: string;
  title?: string;
  className?: string;
  onClick?: () => void;
}

// Map of icon names to MUI icons
const iconMap: Record<string, React.ComponentType> = {
  'tucengshu': TucengshuIcon,
  'xunimanyou': XunimanYouIcon,
  'qixiangjiance': QixiangJianceIcon,
  'tiankonghe': TianKongHeIcon,
};

const IconWrapper: React.FC<IconWrapperProps> = ({
  icon,
  fontSize = 16,
  color,
  title,
  className,
  onClick
}) => {
  const IconComponent = iconMap[icon];

  if (!IconComponent) {
    console.warn(`Icon "${icon}" not found in iconMap`);
    return null;
  }

  return (
    <IconContainer
      fontSize={fontSize}
      color={color}
      title={title}
      className={className}
      onClick={onClick}
    >
      <IconComponent />
    </IconContainer>
  );
};

export default IconWrapper;