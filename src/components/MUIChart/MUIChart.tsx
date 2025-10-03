import React, { useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import { RadarChart } from "@mui/x-charts/RadarChart";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SparkLineChart, SparkLineChartProps } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses, lineElementClasses } from '@mui/x-charts/LineChart';
import { chartsAxisHighlightClasses } from '@mui/x-charts/ChartsAxisHighlight';
import { Title } from "../Layout";

// Define data types for each chart type
interface SparklineChartData {
  data: number[];
  xAxis?: {
    data?: (string | number)[];
    scaleType?: "linear" | "band" | "point" | "time" | "log" | "sqrt";
  };
}

interface RadarChartData {
  series: Array<{
    type?: "radar";
    data: number[];
    label?: string;
    color?: string;
    id?: string;
  }>;
  radar: {
    labelFormatter?: (value: string) => string;
    labelGap?: number;
    max?: number;
    metrics:
      | Array<string>
      | Array<{ max?: number; min?: number; name: string }>;
    startAngle?: number;
  };
  divisions?: number;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

// Main ChartConfig interface
export interface MUIChartConfig {
  id?: string;
  type: "sparkline" | "radar";
  title?: string;
  data: SparklineChartData | RadarChartData;
  width?: number | string;
  height?: number;
  theme?: "light" | "dark";
  interactive?: boolean;
}

// Type guards to validate data structure
const isSparklineData = (data: any): data is SparklineChartData => {
  return (
    typeof data === "object" &&
    data !== null &&
    Array.isArray(data.data) &&
    data.data.every((item: any) => typeof item === "number")
  );
};

const isRadarData = (data: any): data is RadarChartData => {
  return (
    typeof data === "object" &&
    data !== null &&
    Array.isArray(data.series) &&
    data.series.every(
      (item: any) =>
        Array.isArray(item.data) &&
        item.data.every((val: any) => typeof val === "number")
    ) &&
    typeof data.radar === "object" &&
    data.radar !== null &&
    (Array.isArray(data.radar.metrics) &&
      (data.radar.metrics.every((m: any) => typeof m === "string") ||
        data.radar.metrics.every(
          (m: any) => typeof m === "object" && typeof m.name === "string"
        )))
  );
};

export const MUIChart: React.FC<MUIChartConfig> = ({
  data,
  title,
  width,
  height = 300,
  type = "sparkline",
  theme = "dark",
  interactive = true,
}) => {
  // Validate data structure at runtime
  useEffect(() => {
    switch (type) {
      case "sparkline":
        if (!isSparklineData(data)) {
          console.error(
            "Invalid sparkline chart data structure. Expected: { data: number[], xAxis?: {...} }",
            data
          );
        }
        break;
      case "radar":
        if (!isRadarData(data)) {
          console.error(
            "Invalid radar chart data structure. Expected: { series: [{ data: number[] }], radar: { metrics: string[] } }",
            data
          );
        }
        break;
    }
  }, [data, type]);

  // Theme configuration for MUI charts
  const chartSx = useMemo(
    () => ({
      "& .MuiChartsAxis-line": {
        stroke: theme === "dark" ? "#777777" : "#cccccc",
      },
      "& .MuiChartsAxis-tick": {
        stroke: theme === "dark" ? "#777777" : "#cccccc",
      },
      "& .MuiChartsAxis-tickLabel": {
        fill: theme === "dark" ? "#ffffff" : "#333333",
        fontSize: "11px",
      },
      "& .MuiChartsLegend-series text": {
        fill: theme === "dark" ? "#ffffff" : "#333333",
        fontSize: "11px",
      },
      "& .MuiChartsGrid-line": {
        stroke: theme === "dark" ? "#444444" : "#dddddd",
      },
    }),
    [theme]
  );

  // Ensure data is mutable
  const mutableData = useMemo(() => {
    if (!data) return null;

    // Deep clone the data to ensure it's completely mutable
    if (typeof data === "object" && data !== null) {
      return JSON.parse(JSON.stringify(data));
    }
    return data;
  }, [data]);

  const renderChart = () => {
    if (!mutableData) {
      console.warn(`No data provided for ${type} chart`);
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: theme === "dark" ? "#ffffff" : "#333333",
          }}
        >
          No data available
        </Box>
      );
    }

    switch (type) {
      case "sparkline":
        if (!isSparklineData(mutableData)) {
          console.error(
            "Sparkline chart expects data with structure: { data: number[], xAxis?: {...} }"
          );
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "red",
              }}
            >
              Invalid sparkline chart data
            </Box>
          );
        }

        const sparklineData = mutableData as SparklineChartData;

        return (
          <SparkLineChart
            data={sparklineData.data}
            xAxis={sparklineData.xAxis}
            height={height}
            sx={chartSx}
            plotType="line"
            showTooltip={interactive}
            showHighlight={interactive}
            color={theme === "dark" ? "#7afafe" : "#1976d2"}
          />
        );

      case "radar":
        if (!isRadarData(mutableData)) {
          console.error(
            "Radar chart expects data with structure: { series: [{ data: number[] }], radar: { metrics: string[] } }"
          );
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "red",
              }}
            >
              Invalid radar chart data
            </Box>
          );
        }

        const radarData = mutableData as RadarChartData;

        return (
          <RadarChart
            series={radarData.series.map((s, idx) => ({
              type: "radar" as const,
              data: s.data,
              label: s.label,
              id: s.id || `series-${idx}`,
              color: s.color || (theme === "dark" ? "#7afafe" : "#1976d2"),
            }))}
            radar={radarData.radar}
            divisions={radarData.divisions}
            margin={radarData.margin || { top: 50, right: 80, bottom: 80, left: 80 }}
            height={height}
            sx={chartSx}
          />
        );

      default:
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "red",
            }}
          >
            Unsupported chart type: {type}
          </Box>
        );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: height ? `${height}px` : "200px",
        marginBottom: "1.5rem",
        overflow: "hidden",
      }}
    >
      {title && <Title>{title}</Title>}
      <Box
        sx={{
          flex: 1,
          width: width
            ? typeof width === "number"
              ? `${width}px`
              : width
            : "100%",
          height: height ? `${height}px` : "100%",
          borderRadius: "0.5rem",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {renderChart()}
      </Box>
    </Box>
  );
};