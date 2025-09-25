import React, { useMemo } from "react";
import { Box } from "@mui/material";
import {
  pieSampleData,
  barSampleData,
  lineSampleData,
  barSampleData2,
} from "@/sampleData";
import { Panel, ChartConfig } from "../components/Panel/Panel";
import type { CustomContentConfig } from "../components/CustomContent/CustomContent";

const Page1: React.FC = () => {
  // Left panel data
  const leftTrafficData = useMemo(
    () => [
      {
        icon: "/assets/panel/icon_gdp@2x.png",
        label: "YTD",
        value: "23958.3",
        suffix: "k",
      },
      {
        icon: "/assets/panel/icon_gdp@2x.png",
        label: "MTD",
        value: "1987.2",
        suffix: "k",
      },
      {
        icon: "/assets/panel/icon_gdp@2x.png",
        label: "WTD",
        value: "485.7",
        suffix: "k",
      },
      {
        icon: "/assets/panel/icon_gdp@2x.png",
        label: "YTD Growth",
        value: "12.4",
        suffix: "%",
      },
    ],
    []
  );

  // Right panel data
  const rightPersonnelData = useMemo(
    () => [
      { info: "Staff", count: 57, unit: "%" },
      { info: "Visitors", count: 21.8, unit: "%" },
      { info: "Contractors", count: 5.5, unit: "%" },
      { info: "Security", count: 9.3, unit: "%" },
      { info: "Maintenance", count: 6.4, unit: "%" },
    ],
    []
  );

  // Left panel custom content
  const leftCustomContent: CustomContentConfig[] = useMemo(
    () => [
      {
        id: "expenditure",
        type: "traffic",
        title: "Expenditure",
        data: leftTrafficData,
      },
    ],
    [leftTrafficData]
  );

  // Right panel custom content
  const rightCustomContent: CustomContentConfig[] = useMemo(
    () => [
      {
        id: "personnel",
        type: "personnel",
        title: "Personnel Overview",
        data: rightPersonnelData,
      },
    ],
    [rightPersonnelData]
  );

  // Left panel charts
  const leftCharts: ChartConfig[] = useMemo(
    () => [
      {
        id: "incidents-pie",
        type: "pie",
        title: "Incidents Reported by Category (YTD)",
        data: pieSampleData(),
      },
      {
        id: "incidents-bar",
        type: "bar",
        title: "Standard deviation of incidents reported by Category",
        data: barSampleData(),
      },
    ],
    []
  );

  // Right panel charts
  const rightCharts: ChartConfig[] = useMemo(
    () => [
      {
        id: "crowd-flow",
        type: "line",
        title: "Crowd Flow",
        data: lineSampleData(),
      },
      {
        id: "category-bar",
        type: "bar",
        title: "Add Label Here",
        data: barSampleData2(),
      },
    ],
    []
  );

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Left Panel */}
      <Panel
        side="left"
        charts={leftCharts}
        customContent={leftCustomContent}
      />

      {/* Right Panel */}
      <Panel
        side="right"
        charts={rightCharts}
        customContent={rightCustomContent}
      />
    </Box>
  );
};

export default Page1;
