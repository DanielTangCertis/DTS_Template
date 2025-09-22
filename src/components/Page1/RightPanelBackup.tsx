// import React, { useMemo } from "react";
// import { Box, Typography, List, ListItem, styled } from "@mui/material";
// import { Person as PersonIcon } from "@mui/icons-material";
// import { ResponsiveLine } from "@nivo/line";
// import { ResponsiveBar } from "@nivo/bar";
// import { LayoutBox, LeaseTitle } from "../Layout";
// import { lineSampleData, barSampleData2 } from "./sampleData";
// import Chart from "../Chart";

// const ContentContainer = styled(Box)({
//   width: "350px",
//   paddingLeft: "90px",
// });

// const ChartContainer = styled(Box)({
//   height: "250px",
//   width: "350px",
//   marginBottom: "20px",
// });

// const PersonnelContainer = styled(Box)({
//   marginBottom: "10px",
//   marginLeft: "10px",
//   width: "350px",
// });

// const PersonnelItem = styled(ListItem)({
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   borderBottom: "1px solid rgba(255, 255, 255, 0.16)",
//   padding: "8px 5px",
// });

// const PersonnelValue = styled(Typography)({
//   fontSize: "18px",
//   fontFamily: "PangMenZhengDao, Arial, sans-serif",
//   color: "#00ffff",
//   fontWeight: "bold",
// });

// const PersonnelLabel = styled(Typography)({
//   fontSize: "14px",
//   color: "#ffffff",
//   display: "flex",
//   alignItems: "center",
// });

// export const RightPanel: React.FC = () => {
//   // Sample data for line chart. https://nivo.rocks/line/
//   const crowdFlowData = useMemo(() => lineSampleData(), []);

//   // Sample data for bar chart
//   const categoryData = useMemo(() => barSampleData2(), []);

//   // Personnel overview data
//   const personnelData = useMemo(
//     () => [
//       { info: "Staff", count: 57, unit: "%" },
//       { info: "Visitors", count: 21.8, unit: "%" },
//       { info: "Contractors", count: 5.5, unit: "%" },
//       { info: "Security", count: 9.3, unit: "%" },
//       { info: "Maintenance", count: 6.4, unit: "%" },
//     ],
//     []
//   );

//   return (
//     <LayoutBox side="right" delay={0.3}>
//       <ContentContainer>
//         {/* Crowd Flow Chart */}
//         <Box sx={{ marginBottom: "30px" }}>
//           <LeaseTitle>Crowd Flow</LeaseTitle>
//           <ChartContainer>
//             <Chart data={crowdFlowData} type="line" />
//             {/* <ResponsiveLine
//               data={crowdFlowData}
//               margin={{ top: 20, right: 60, bottom: 60, left: 60 }}
//               xScale={{ type: "point" }}
//               yScale={{
//                 type: "linear",
//                 min: 40,
//                 max: "auto",
//                 stacked: false,
//                 reverse: false,
//               }}
//               curve="monotoneX"
//               axisTop={null}
//               axisRight={null}
//               axisBottom={{
//                 tickSize: 5,
//                 tickPadding: 5,
//                 tickRotation: 0,
//                 legendOffset: 36,
//                 legendPosition: "middle",
//               }}
//               axisLeft={{
//                 tickSize: 5,
//                 tickPadding: 5,
//                 tickRotation: 0,
//                 legend: "(thousand)",
//                 legendOffset: -45,
//                 legendPosition: "middle",
//               }}
//               enableGridX={false}
//               enableGridY={true}
//               colors={({ id }) => (id === "Inflow" ? "#00c484" : "#ebeb15")}
//               lineWidth={3}
//               pointSize={5}
//               pointColor={{ theme: "background" }}
//               pointBorderWidth={2}
//               pointBorderColor={{ from: "serieColor" }}
//               enableArea={true}
//               areaOpacity={0.3}
//               useMesh={true}
//               legends={[
//                 {
//                   anchor: "top-right",
//                   direction: "column",
//                   justify: false,
//                   translateX: 50,
//                   translateY: 0,
//                   itemsSpacing: 0,
//                   itemDirection: "left-to-right",
//                   itemWidth: 80,
//                   itemHeight: 20,
//                   itemOpacity: 0.75,
//                   symbolSize: 12,
//                   symbolShape: "circle",
//                   symbolBorderColor: "rgba(0, 0, 0, .5)",
//                   itemTextColor: "#ffffff",
//                 },
//               ]}
//               theme={{
//                 axis: {
//                   ticks: {
//                     text: { fill: "#ffffff", fontSize: 10 },
//                   },
//                   legend: {
//                     text: { fill: "#ffffff", fontSize: 12 },
//                   },
//                 },
//                 grid: {
//                   line: {
//                     stroke: "#444444",
//                     strokeDasharray: "4 4",
//                   },
//                 },
//                 tooltip: {
//                   container: {
//                     background: "#000000",
//                     color: "#ffffff",
//                     border: "1px solid #444444",
//                   },
//                 },
//               }}
//             /> */}
//           </ChartContainer>
//         </Box>

//         {/* Personnel Overview */}
//         <Box sx={{ marginBottom: "30px" }}>
//           <LeaseTitle>Personnel Overview</LeaseTitle>
//           <PersonnelContainer>
//             <List sx={{ padding: 0 }}>
//               {personnelData.map((item, index) => (
//                 <PersonnelItem key={index}>
//                   <Box sx={{ display: "flex", alignItems: "center" }}>
//                     <PersonIcon
//                       sx={{
//                         marginRight: "5px",
//                         fontSize: "16px",
//                         color: "#ffffff",
//                       }}
//                     />
//                     <PersonnelLabel>{item.info}</PersonnelLabel>
//                   </Box>
//                   <PersonnelValue>
//                     {item.count}
//                     <Typography
//                       component="span"
//                       sx={{
//                         color: "#93c0ec",
//                         fontSize: "14px",
//                         marginLeft: "2px",
//                       }}
//                     >
//                       {item.unit}
//                     </Typography>
//                   </PersonnelValue>
//                 </PersonnelItem>
//               ))}
//             </List>
//           </PersonnelContainer>
//         </Box>

//         {/* Category Bar Chart */}
//         <Box sx={{ marginBottom: "30px" }}>
//           <LeaseTitle>Add Label Here</LeaseTitle>
//           <ChartContainer sx={{ height: "300px" }}>
//             <Chart data={categoryData} type="bar"/>
//             {/* <ResponsiveBar
//               data={categoryData}
//               keys={["value"]}
//               indexBy="category"
//               margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
//               padding={0.4}
//               valueScale={{ type: "linear" }}
//               indexScale={{ type: "band", round: true }}
//               colors={["#0097fb"]}
//               borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
//               axisTop={null}
//               axisRight={null}
//               axisBottom={{
//                 tickSize: 5,
//                 tickPadding: 5,
//                 tickRotation: 0,
//               }}
//               axisLeft={{
//                 tickSize: 5,
//                 tickPadding: 5,
//                 tickRotation: 0,
//               }}
//               enableGridY={true}
//               labelSkipWidth={12}
//               labelSkipHeight={12}
//               labelTextColor="#ffffff"
//               animate={true}
//               motionConfig="gentle"
//               theme={{
//                 axis: {
//                   ticks: {
//                     text: { fill: "#65D5FF", fontSize: 10 },
//                   },
//                 },
//                 grid: {
//                   line: {
//                     stroke: "rgba(77, 128, 254, 0.2)",
//                   },
//                 },
//                 tooltip: {
//                   container: {
//                     background: "RGBA(0, 49, 85, 1)",
//                     color: "#BCE9FC",
//                     border: "1px solid rgba(0, 151, 251, 1)",
//                     borderRadius: 0,
//                   },
//                 },
//               }}
//             /> */}
//           </ChartContainer>
//         </Box>
//       </ContentContainer>
//     </LayoutBox>
//   );
// };

// export default RightPanel;
