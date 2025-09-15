import React, { useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Slider,
  Switch,
  FormControlLabel,
  Button,
  Typography,
  Fade,
  styled,
  ButtonBase,
} from "@mui/material";
import { useDigitalTwinApi } from "@/hooks/useDigitalTwinApi";
import { WeatherOptions } from "@/utils/weatherUtils";

let sunnyIcon = "/assets/weather/Sunny.png";
let cloudyIcon = "/assets/weather/Cloudy.png";
let rainIcon = "/assets/weather/Rain.png";
let snowIcon = "/assets/weather/Snow.png";

const WeatherContainer = styled(Box)({
  position: "absolute",
  top: "80px",
  right: "40px",
  padding: "10px",
  borderRadius: "2%",
  zIndex: 10,
  background: "rgba(0, 0, 0, 0.331)",
  fontFamily: "Tencent, Arial, sans-serif",
});

const WeatherCard = styled(Card)({
  backgroundColor: "transparent",
  boxShadow: "none",
});

const WeatherGrid = styled(Box)({
  display: "grid",
  gridTemplateRows: "2fr 1fr 1fr",
  gap: "10px",
});

const WeatherItemsContainer = styled(Box)({
  display: "flex",
  marginBottom: "10px",
  whiteSpace: "nowrap",
});

const WeatherItem = styled(ButtonBase)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "10px 15px",
  cursor: "pointer",
  borderRadius: "8px",
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});

const WeatherIcon = styled("img")({
  width: "30px",
  height: "30px",
});

const WeatherText = styled(Typography)({
  color: "rgba(255, 255, 255, 0.8)",
  fontSize: "14px",
  marginTop: "5px",
});

const SliderContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  height: "30px",
  padding: "0 25px 0 15px",
});

const TimeDisplay = styled(Typography)({
  color: "#fff",
  width: "40px",
  fontSize: "14px",
});

const StyledSlider = styled(Slider)({
  width: "160px",
  marginLeft: "10px",
  color: "#66ddff",
  "& .MuiSlider-track": {
    background: "linear-gradient(90deg, #66ddff, #409eff)",
    animation: "liuguang 2s infinite linear",
  },
  "& .MuiSlider-rail": {
    backgroundColor: "rgba(0, 0, 0, 0.258)",
  },
  "& .MuiSlider-thumb": {
    width: "15px",
    height: "15px",
    background: "radial-gradient(rgba(102, 221, 255, 0.9), rgba(0, 0, 0, 0.8))",
    border: "2px solid rgb(102, 221, 255)",
  },
});

const ControlsContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const DarkModeContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  fontSize: "16px",
  padding: "0 25px 0 12px",
});

const ResetButton = styled(Button)({
  fontSize: "16px",
  marginTop: "8px",
  marginLeft: "10px",
  border: "1px solid #fff",
  borderRadius: "5px",
  color: "rgba(255, 255, 255, 0.8)",
  padding: "3px 5px",
  minWidth: "auto",
  "&:hover": {
    color: "#409eff",
    borderColor: "#409eff",
  },
});

interface WeatherItem {
  name: string;
  icon: string;
  options: WeatherOptions;
}

const weatherItems: WeatherItem[] = [
  {
    name: "Sunny",
    icon: sunnyIcon,
    options: {
      cloudDensity: 0.1,
      SunIntensity: 15,
    },
  },
  {
    name: "Cloudy",
    icon: cloudyIcon,
    options: {
      cloudDensity: 0.8,
      SunIntensity: 7,
    },
  },
  {
    name: "Rain",
    icon: rainIcon,
    options: {
      cloudDensity: 0.8,
      sunIntensity: 8,
      rainParam: [0.2, 0.2, 0.2, "White", 0.2, 0.05],
    },
  },
  {
    name: "Snow",
    icon: snowIcon,
    options: {
      cloudDensity: 0.8,
      sunIntensity: 8,
      snowParam: [0.2, 0.2, 0.2, "White", 0.2, 0.05],
    },
  },
];

const Weather: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(8 * 60 * 60 + 53 * 60); // 8:53 AM in seconds
  const [isDark, setIsDark] = useState(false);
  
  // Use the consolidated hook methods instead of duplicating logic
  const { resetPlayer, setDarkMode, setWeatherTime, updateWeather } = useDigitalTwinApi();

  const sliderFormat = useCallback((time: number): string => {
    const [hour, minute] = getHourMinute(time);
    return `${hour}:${minute}`;
  }, []);

  const getHourMinute = useCallback((time: number): [string, string] => {
    const [hourStr, fraction] = (time / 60 / 60).toFixed(2).split(".");
    const hour = hourStr;
    const minutes = Math.floor(Number("0." + fraction) * 60)
      .toString()
      .padStart(2, "0");
    return [hour, minutes];
  }, []);

  const handleTimeSliderChange = useCallback(
    async (event: Event, value: number | number[]) => {
      const time = Array.isArray(value) ? value[0] : value;
      setCurrentTime(time);

      try {
        const [hour, minute] = getHourMinute(time);
        await setWeatherTime(Number(hour), Number(minute));
      } catch (error) {
        console.error("Error setting time:", error);
      }
    },
    [getHourMinute, setWeatherTime]
  );

  const handleDarkModeChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const newIsDark = event.target.checked;
      setIsDark(newIsDark);

      try {
        await setDarkMode(newIsDark);
      } catch (error) {
        console.error("Error setting dark mode:", error);
      }
    },
    [setDarkMode]
  );

  const handleWeatherInit = useCallback(async () => {
    try {
      // Reset player with weather and environment flags (2 | 4 = 6)
      await resetPlayer(6);
      setIsDark(false);
      setCurrentTime(8 * 60 * 60 + 53 * 60); // Reset to 8:53 AM
    } catch (error) {
      console.error("Error resetting weather:", error);
    }
  }, [resetPlayer]);

  const handleWeatherChange = useCallback(async (options: WeatherOptions) => {
    try {
      await updateWeather(options);
    } catch (error) {
      console.error("Error changing weather:", error);
    }
  }, [updateWeather]);

  return (
    <Fade in={true} timeout={1000} style={{ transitionDelay: "300ms" }}>
      <WeatherContainer>
        <WeatherCard>
          <CardContent sx={{ p: 0 }}>
            <WeatherGrid>
              {/* Weather Items */}
              <WeatherItemsContainer>
                {weatherItems.map((item, index) => (
                  <WeatherItem
                    key={index}
                    onClick={() => handleWeatherChange(item.options)}
                  >
                    <WeatherIcon src={item.icon} alt={item.name} />
                    <WeatherText>{item.name}</WeatherText>
                  </WeatherItem>
                ))}
              </WeatherItemsContainer>

              {/* Time Slider */}
              <SliderContainer>
                <TimeDisplay>{sliderFormat(currentTime)}</TimeDisplay>
                <StyledSlider
                  value={currentTime}
                  onChange={handleTimeSliderChange}
                  min={1}
                  max={86380}
                  step={60 * 10} // 10-minute steps
                />
              </SliderContainer>

              {/* Controls */}
              <ControlsContainer>
                <DarkModeContainer>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isDark}
                        onChange={handleDarkModeChange}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#0c0c0c",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: "#0c0c0c",
                            },
                          "& .MuiSwitch-track": {
                            backgroundColor: "#ccc",
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: "16px",
                        }}
                      >
                        Toggle Scene Lighting:
                      </Typography>
                    }
                    labelPlacement="start"
                  />
                </DarkModeContainer>

                <ResetButton onClick={handleWeatherInit}>Reset</ResetButton>
              </ControlsContainer>
            </WeatherGrid>
          </CardContent>
        </WeatherCard>
      </WeatherContainer>
    </Fade>
  );
};

export default Weather;