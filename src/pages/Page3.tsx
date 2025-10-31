import { Box } from "@mui/material";
import {
  pieSampleData,
  lineSampleData,
  lineSampleData2,
  barSampleData2,
} from "@/data/sampleData";
import {
  facilityRadarData,
  sparklineSampleData,
  sparklineSampleData2,
} from "@/components/MUIChart/MUIChartSampleData";
import { Panel } from "../components/Panel/Panel";
import { NivoChart } from "@/components/NivoChart/NivoChart";
import { MUIChart } from "@/components/MUIChart/MUIChart";
import { CustomContent } from "@/components/CustomContent/CustomContent";
import EquipmentFlowChart from "@/components/HierarchyAffected/hierarchyAffected";
import { Height } from "@mui/icons-material";

const Page3: React.FC = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Right Panel */}
      <Panel side="right" delay={0}>
        <MUIChart type="radar" title="Facilities" data={facilityRadarData()} />
        <MUIChart
          type="sparkline"
          title="Energy Consumption by Month"
          data={sparklineSampleData2()}
        />
      </Panel>

      {/* Left Panel */}
      <Panel side="left" delay={0}>
        {/* <NivoChart type="line" title="Crowd Flow" data={lineSampleData()} /> */}
        <CustomContent style={{ height: "60vh", width: "100%" }}>
          <EquipmentFlowChart />
        </CustomContent>
        <NivoChart
          type="bar"
          title="This is a bar chart"
          data={barSampleData2()}
        />
      </Panel>
    </Box>
  );
};

export default Page3;
