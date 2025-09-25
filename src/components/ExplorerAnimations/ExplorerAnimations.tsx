import React, { useEffect } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Fade,
  styled,
  Grid,
} from "@mui/material";
import { useDigitalTwin } from "../../contexts/DigitalTwinContext";
import { useHeader } from "../../contexts/HeaderContext";
import { digitalTwinService } from "../../services/DigitalTwinService";

const AnimationContainer = styled(Box)({
  position: "absolute",
  height: "70vh",
  width: "350px",
  margin: "50px 0 50px 50px",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "10px",
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(0, 0, 0, 0.1)",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(255, 255, 255, 0.5)",
    borderRadius: "5px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "rgba(255, 255, 255, 0.8)",
  },
});

const AnimationCard = styled(Card)({
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});

const AnimationImage = styled(CardMedia)({
  height: 120,
  backgroundSize: "cover",
  backgroundPosition: "center",
});

const AnimationText = styled(Typography)({
  color: "rgba(255, 255, 255, 0.7)",
  fontSize: "14px",
  textAlign: "center",
  padding: "8px",
});

interface AnimationItem {
  id: string | number;
  name: string;
  img: string;
}

const Animation: React.FC = () => {
  const { state: digitalTwinState } = useDigitalTwin();
  const { state: headerState } = useHeader();

  useEffect(() => {
    // Stop animation when component is hidden
    if (!headerState.showAnimation) {
      digitalTwinService.stopAnimation().catch(console.error);
    }
  }, [headerState.showAnimation]);

  const handleAnimationClick = async (item: AnimationItem) => {
    try {
      const success = await digitalTwinService.playAnimation(item.id);
      if (!success) {
        console.warn('Failed to play animation:', item.name);
      }
    } catch (error) {
      console.error("Error playing animation:", error);
    }
  };

  // Graceful handling of missing animation data
  if (!digitalTwinState.animationList || digitalTwinState.animationList.length === 0) {
    return (
      <AnimationContainer>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          color: 'rgba(255, 255, 255, 0.6)'
        }}>
          <Typography variant="body2">
            No animations available
          </Typography>
        </Box>
      </AnimationContainer>
    );
  }

  return (
    <Fade in={true} timeout={1000} style={{ transitionDelay: "300ms" }}>
      <AnimationContainer>
        <Grid container spacing={2}>
          {digitalTwinState.animationList.map((item) => (
            <Grid size={6} key={item.id}>
              <AnimationCard onClick={() => handleAnimationClick(item)}>
                <AnimationImage 
                  image={item.img || '/placeholder-animation.png'} 
                  title={item.name} 
                />
                <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                  <AnimationText variant="body2">{item.name}</AnimationText>
                </CardContent>
              </AnimationCard>
            </Grid>
          ))}
        </Grid>
      </AnimationContainer>
    </Fade>
  );
};

export default Animation;