import React from "react";
import { Box, Typography, styled } from "@mui/material";
import { IconWrapper } from "../Icons";

const TitleContainer = styled(Box)({
  position: "relative",
  fontFamily: "Oppo, serif",
  fontWeight: 500,
  color: "#ffffff",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  width: "350px",
  height: "50px",
  fontSize: "16px",
  overflow: "hidden",
  backgroundImage: 'url("./tiltle_s@2x.png")',
  backgroundRepeat: "no-repeat",
  backgroundSize: "100% 100%",
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
});

const TitleIcon = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "32px",
  height: "32px",
});

const TitleText = styled(Box)({
  flex: 1,
  marginLeft: "9px",
  position: "relative",
  top: "1px",
  width: "fit-content",
});

const SubTitle = styled(Typography)({
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
  color: "rgba(255, 255, 255, 0.5)",
  fontSize: "10px",
});

interface TitleProps {
  children: React.ReactNode;
  icon?: string;
  subtitle?: string;
}

export const Title: React.FC<TitleProps> = ({
  children,
  icon = "tucengshu",
  subtitle,
}) => {
  return (
    <TitleContainer>
      <TitleIcon>
        <IconWrapper icon={icon} fontSize={24} />
      </TitleIcon>
      <TitleText>
        <Typography variant="body1" sx={{ color: "inherit" }}>
          {children}
        </Typography>
        {subtitle && <SubTitle variant="caption">{subtitle}</SubTitle>}
      </TitleText>
    </TitleContainer>
  );
};
