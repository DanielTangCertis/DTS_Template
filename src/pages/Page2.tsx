import { Box } from "@mui/material";
import { lineSampleData2 } from "@/data/sampleData";
import { Panel } from "../components/Panel/Panel";
import { NivoChart } from "@/components/NivoChart/NivoChart";

import {
  pieSampleData,
  lineSampleData,
  barSampleData2,
} from "@/data/sampleData";

const Page2: React.FC = () => {
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
      <Panel side="left" delay={0}>
        <NivoChart
          type="pie"
          title="Incidents Reported by Category (YTD)"
          data={pieSampleData()}
        />
        <NivoChart
          type="line"
          title="Energy Consumption"
          data={lineSampleData2()}
        />
      </Panel>

      {/* Right Panel */}
      <Panel side="right" delay={0}>
        <NivoChart type="line" title="Crowd Flow" data={lineSampleData()} />
        <NivoChart
          type="bar"
          title="This is a bar chart"
          data={barSampleData2()}
        />
      </Panel>
    </Box>
  );
};

export default Page2;
