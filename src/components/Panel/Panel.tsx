import React from "react";
import { Box } from "@mui/material";
import { Title } from "../Layout";
import { NivoChart } from "../NivoChart/NivoChart";
import {
  CustomContent,
  CustomContentConfig,
} from "../CustomContent/CustomContent";
import styles from "./Panel.module.css";

// Define the chart configuration interface
export interface ChartConfig {
  id: string;
  type: "line" | "bar" | "pie" | "scatter";
  title: string;
  data: any[];
  width?: number;
  height?: number;
  theme?: "light" | "dark";
  interactive?: boolean;
}

// Main Panel props interface
export interface PanelProps {
  side: "left" | "right";
  charts?: ChartConfig[];
  customContent?: CustomContentConfig[];
  width?: string;
}

export const Panel: React.FC<PanelProps> = ({
  side,
  charts = [],
  customContent = [],
  width,
}) => {
  const panelClass = side === "left" ? styles.panelLeft : styles.panelRight;
  const customWidthStyle = width ? { width } : {};

  const renderChart = (chartConfig: ChartConfig) => (
    <Box key={chartConfig.id} className={styles.chartSection}>
      <Title>{chartConfig.title}</Title>
      <Box className={styles.chartContainer}>
        <NivoChart
          data={chartConfig.data}
          type={chartConfig.type}
          width={chartConfig.width} // Pass optional width
          height={chartConfig.height} // Pass optional height
          theme={chartConfig.theme || "dark"}
          interactive={chartConfig.interactive !== false}
        />
      </Box>
    </Box>
  );

  return (
    <Box
      className={`${styles.panelContainer} ${panelClass}`}
      style={customWidthStyle}
    >
      {/* Render custom content first */}
      {customContent.map((content) => (
        <CustomContent key={content.id} config={content} />
      ))}

      {/* Render charts */}
      {charts.map((chartConfig) => renderChart(chartConfig))}
    </Box>
  );
};