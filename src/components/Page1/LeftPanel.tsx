import React from "react";
import { Box, Typography, Grid, styled } from "@mui/material";
import { LeaseTitle, IconBox } from "../Layout";
import { pieSampleData, barSampleData } from "./sampleData";

export const LeftPanel: React.FC = () => {
  const trafficData = [
    {
      icon: "/src/assets/panel/icon_gdp@2x.png",
      label: "YTD",
      value: "23958.3",
      suffix: "k",
    },
    // ... other data items
  ];

  return (
    <>
      <Box sx={{ paddingRight: "50px" }}>
        <LeaseTitle>Expenditure</LeaseTitle>
        {/* Traffic data grid */}
        <Grid container spacing={2}>
          {trafficData.map((item, index) => (
            <Grid size={6} key={index}>
              <Box display="flex">
                <IconBox width={30} height={30}>
                  <img src={item.icon} alt={item.label} />
                </IconBox>
                <Box sx={{ marginLeft: "11px" }}>
                  <Typography sx={{ fontSize: "14px", color: "#ffffff" }}>
                    {item.label}
                  </Typography>
                  <Box
                    sx={{ fontSize: "18px", color: "#00ffff", display: "flex" }}
                  >
                    {item.value}
                    <Box
                      sx={{
                        fontSize: "16px",
                        color: "#93c0ec",
                        marginLeft: "12.7px",
                      }}
                    >
                      {item.suffix}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};
