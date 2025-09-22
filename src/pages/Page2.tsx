import React from "react";
import { Box, styled } from "@mui/material";
import { LayoutBox } from "../components/Layout";
import { ResponsiveLine } from "@nivo/line";
import { lineSampleData2 } from "@/components/Page1/sampleData";
const Page2Container = styled(Box)({
  width: "100%",
  height: "100%",
  position: "relative",
  overflow: "hidden",
});

const Page2: React.FC = () => {
  return (
    <Page2Container>
      <LayoutBox side="left" delay={0.3}>
        <ResponsiveLine /* or Line for fixed dimensions */
          data={lineSampleData2()}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: true,
            reverse: false,
          }}
          curve="basis"
          axisBottom={{ legend: "transportation", legendOffset: 36 }}
          axisLeft={{ legend: "count", legendOffset: -40 }}
          colors={{ scheme: "dark2" }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "seriesColor" }}
          pointLabelYOffset={-12}
          enableTouchCrosshair={true}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              translateX: 100,
              itemWidth: 80,
              itemHeight: 22,
              symbolShape: "circle",
            },
          ]}
        />
      </LayoutBox>
      <LayoutBox side="right" delay={0.3}>
        <Box>Content</Box>
      </LayoutBox>
    </Page2Container>
  );
};

export default Page2;
