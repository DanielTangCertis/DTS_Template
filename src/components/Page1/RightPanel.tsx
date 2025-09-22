import React, { useMemo } from "react";
import { Box, Typography, List, ListItem, styled } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { LayoutBox, LeaseTitle } from "../Layout";
import { lineSampleData, barSampleData2 } from "./sampleData";

const ContentContainer = styled(Box)({
  width: "350px",
  paddingLeft: "90px",
});

const ChartContainer = styled(Box)({
  height: "250px",
  width: "350px",
  marginBottom: "20px",
});

const PersonnelContainer = styled(Box)({
  marginBottom: "10px",
  marginLeft: "10px",
  width: "350px",
});

const PersonnelItem = styled(ListItem)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid rgba(255, 255, 255, 0.16)",
  padding: "8px 5px",
});

const PersonnelValue = styled(Typography)({
  fontSize: "18px",
  fontFamily: "PangMenZhengDao, Arial, sans-serif",
  color: "#00ffff",
  fontWeight: "bold",
});

const PersonnelLabel = styled(Typography)({
  fontSize: "14px",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
});

export const RightPanel: React.FC = () => {
  // Sample data for line chart. https://nivo.rocks/line/
  const crowdFlowData = useMemo(() => lineSampleData(), []);

  // Sample data for bar chart
  const categoryData = useMemo(() => barSampleData2(), []);

  // Personnel overview data
  const personnelData = useMemo(
    () => [
      { info: "Staff", count: 57, unit: "%" },
      { info: "Visitors", count: 21.8, unit: "%" },
      { info: "Contractors", count: 5.5, unit: "%" },
      { info: "Security", count: 9.3, unit: "%" },
      { info: "Maintenance", count: 6.4, unit: "%" },
    ],
    []
  );

  return (
    <LayoutBox side="right" delay={0.3}>
      <ContentContainer>
        {/* Crowd Flow Chart */}
        <Box sx={{ marginBottom: "30px" }}>
          <LeaseTitle>Crowd Flow</LeaseTitle>
          <ChartContainer></ChartContainer>
        </Box>

        {/* Personnel Overview */}
        <Box sx={{ marginBottom: "30px" }}>
          <LeaseTitle>Personnel Overview</LeaseTitle>
          <PersonnelContainer>
            <List sx={{ padding: 0 }}>
              {personnelData.map((item, index) => (
                <PersonnelItem key={index}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PersonIcon
                      sx={{
                        marginRight: "5px",
                        fontSize: "16px",
                        color: "#ffffff",
                      }}
                    />
                    <PersonnelLabel>{item.info}</PersonnelLabel>
                  </Box>
                  <PersonnelValue>
                    {item.count}
                    <Typography
                      component="span"
                      sx={{
                        color: "#93c0ec",
                        fontSize: "14px",
                        marginLeft: "2px",
                      }}
                    >
                      {item.unit}
                    </Typography>
                  </PersonnelValue>
                </PersonnelItem>
              ))}
            </List>
          </PersonnelContainer>
        </Box>
      </ContentContainer>
    </LayoutBox>
  );
};

export default RightPanel;
