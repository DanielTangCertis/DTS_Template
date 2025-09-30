import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, ButtonBase, Typography, Fade, styled } from "@mui/material";

// set default and active images
let img1Default = "/assets/link/1级菜单_icon1_默认.png";
let img1Active = "/assets/link/1级菜单_icon1_选中.png";
let img3Default = "/assets/link/1级菜单_icon3_默认.png";
let img3Active = "/assets/link/1级菜单_icon3_选中.png";
let img5Default = "/assets/link/1级菜单_icon5_默认.png";
let img5Active = "/assets/link/1级菜单_icon5_选中.png";

const NavigationContainer = styled(Box)({
  position: "absolute",
  bottom: "40px",
  width: "700px",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 10,
  height: "102px",
});

const NavigationLinks = styled(Box)({
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  bottom: 0,
  top: "120px",
  margin: "auto",
  zIndex: 10,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const NavigationButton = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== "active", // Prevent 'active' from reaching DOM
})<{ active?: boolean }>(({ active }) => ({
  width: "152px",
  height: "38px",
  margin: "0 27px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  fontSize: "18px",
  transition: "all 0.5s",
  color: active ? "#ffffff" : "rgba(255, 255, 255, 0.8)",
  letterSpacing: active ? "1px" : "0px",
  "&:hover": {
    color: "#ffffff",
    transform: "scale(1.05)",
  },
}));

const NavigationImage = styled("img")({
  width: "130px",
  position: "absolute",
  transform: "translate(0, -90%)",
  transition: "all 0.3s",
});

const NavigationText = styled(Typography)({
  position: "absolute",
  bottom: "55px",
  width: "130px",
  height: "40px",
  fontSize: "18px",
  letterSpacing: "5px",
  fontFamily: "Oppo, serif",
  color: "rgba(255, 255, 255, 0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export interface NavigationItem {
  name: string;
  key: number;
  path: string;
  icon: string;
  img: string;
  activeImg: string;
}

export const navigationItems: NavigationItem[] = [
  {
    name: "Page1",
    key: 1,
    path: "/page1", // Match the nested route structure
    icon: "icon1",
    img: img1Default,
    activeImg: img1Active,
  },
  {
    name: "Page2",
    key: 2,
    path: "/page2", // Match the nested route structure
    icon: "icon3",
    img: img3Default,
    activeImg: img3Active,
  },
  {
    name: "Page3",
    key: 3,
    path: "/page3", // Match the nested route structure
    icon: "icon5",
    img: img5Default,
    activeImg: img5Active,
  },
];

export const RouterNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  const handleNavigation = (item: NavigationItem) => {
    navigate(item.path);
    setCurrentPath(item.path);
  };

  // Check if current path matches the navigation item path
  const isActive = (path: string) => location.pathname === path;

  return (
    <Fade in timeout={1000}>
      <NavigationContainer>
        <NavigationLinks>
          {navigationItems.map((item) => (
            <NavigationButton
              key={item.key}
              active={isActive(item.path)}
              onClick={() => handleNavigation(item)}
            >
              <Box
                sx={{
                  width: "152px",
                  position: "relative",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Fade in={isActive(item.path)} timeout={300}>
                  <NavigationImage
                    src={item.activeImg}
                    alt={item.name}
                    style={{ display: isActive(item.path) ? "block" : "none" }}
                  />
                </Fade>
                <Fade in={!isActive(item.path)} timeout={300}>
                  <NavigationImage
                    src={item.img}
                    alt={item.name}
                    style={{ display: !isActive(item.path) ? "block" : "none" }}
                  />
                </Fade>
              </Box>
              <NavigationText>{item.name}</NavigationText>
            </NavigationButton>
          ))}
        </NavigationLinks>
      </NavigationContainer>
    </Fade>
  );
};