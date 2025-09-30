import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Box, styled } from "@mui/material";
import { lineSampleData2 } from "@/sampleData";
import { Panel, ChartConfig } from "../components/Panel/Panel";
import type { CustomContentConfig } from "../components/CustomContent/CustomContent";

import {
  pieSampleData,
  barSampleData,
  lineSampleData,
  barSampleData2,
} from "@/sampleData";

const Page2: React.FC = () => {
  // const [lineData, setLineData] = useState<any[]>([]);

  // const memoizedLineData = useCallback(() => {
  //   return lineSampleData2();
  // }, []); // Empty dependency array means this function is created only once

  // useEffect(() => {
  //   setLineData(memoizedLineData());
  // }, [memoizedLineData]); // Now, the useEffect hook only runs when memoizedLineData changes

  // // Left panel custom content
  // const leftCustomContent: CustomContentConfig[] = useMemo(
  //   () => [
  //     {
  //       id: "expenditure",
  //       type: "traffic",
  //       title: "Expenditure",
  //       data: leftTrafficData,
  //     },
  //   ],
  //   [leftTrafficData]
  // );

  // // Right panel custom content
  // const rightCustomContent: CustomContentConfig[] = useMemo(
  //   () => [
  //     {
  //       id: "personnel",
  //       type: "personnel",
  //       title: "Personnel Overview",
  //       data: rightPersonnelData,
  //     },
  //   ],
  //   [rightPersonnelData]
  // );

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
        id: "incidents-line",
        type: "line",
        title: "Energy Consumption",
        data: lineSampleData2(),
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
            // customContent={leftCustomContent}
          />
    
          {/* Right Panel */}
          <Panel
            side="right"
            charts={rightCharts}
            // customContent={rightCustomContent}
          />
        </Box>
      );
};

export default Page2;
