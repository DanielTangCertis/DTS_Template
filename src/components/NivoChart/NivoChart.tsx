import React, { useEffect, useRef, useState, useMemo } from "react";
import { Box } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";

// Use React's ComponentProps to get the exact prop types
type LineChartProps = React.ComponentProps<typeof ResponsiveLine>;
type BarChartProps = React.ComponentProps<typeof ResponsiveBar>;
type PieChartProps = React.ComponentProps<typeof ResponsivePie>;
type ScatterChartProps = React.ComponentProps<typeof ResponsiveScatterPlot>;

// Define proper data types for each chart type
interface LineChartData {
  id: string | number;
  data: Array<{
    x: string | number | Date;
    y: string | number | Date;
  }>;
}

interface BarChartData {
  [key: string]: string | number;
}

interface PieChartData {
  id: string | number;
  label?: string;
  value: number;
  color?: string;
}

interface ScatterPlotData {
  id: string | number;
  data: Array<{
    x: number;
    y: number;
  }>;
}

interface ChartProps {
  data: LineChartData[] | BarChartData[] | PieChartData[] | ScatterPlotData[];
  width?: number; // Optional - if provided, uses fixed width
  height?: number; // Optional - if provided, uses fixed height
  type?: "line" | "bar" | "pie" | "scatter";
  theme?: "light" | "dark";
  interactive?: boolean;
}

// Type guards to validate data structure
const isLineData = (data: any): data is LineChartData[] => {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        typeof item.id !== "undefined" &&
        Array.isArray(item.data) &&
        item.data.every(
          (point: any) =>
            typeof point.x !== "undefined" && typeof point.y !== "undefined"
        )
    )
  );
};

const isBarData = (data: any): data is BarChartData[] => {
  return (
    Array.isArray(data) &&
    data.every((item) => typeof item === "object" && item !== null)
  );
};

const isPieData = (data: any): data is PieChartData[] => {
  return (
    Array.isArray(data) &&
    data.every(
      (item) => typeof item.id !== "undefined" && typeof item.value === "number"
    )
  );
};

const isScatterData = (data: any): data is ScatterPlotData[] => {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        typeof item.id !== "undefined" &&
        Array.isArray(item.data) &&
        item.data.every(
          (point: any) =>
            typeof point.x === "number" && typeof point.y === "number"
        )
    )
  );
};

export const NivoChart: React.FC<ChartProps> = ({
  data,
  width,
  height,
  type = "line",
  theme = "dark",
  interactive = true,
}) => {
  // Validate data structure at runtime
  useEffect(() => {
    switch (type) {
      case "line":
        if (!isLineData(data)) {
          console.error(
            "Invalid line chart data structure. Expected: { id: string, data: { x: any, y: any }[] }[]",
            data
          );
        }
        break;
      case "bar":
        if (!isBarData(data)) {
          console.error(
            "Invalid bar chart data structure. Expected: { [key: string]: string | number }[]",
            data
          );
        }
        break;
      case "pie":
        if (!isPieData(data)) {
          console.error(
            "Invalid pie chart data structure. Expected: { id: string, value: number }[]",
            data
          );
        }
        break;
      case "scatter":
        if (!isScatterData(data)) {
          console.error(
            "Invalid scatter chart data structure. Expected: { id: string, data: { x: number, y: number }[] }[]",
            data
          );
        }
        break;
    }
  }, [data, type]);

  const commonTheme = {
    background: theme === "dark" ? "#1a1a1a" : "#ffffff",
    text: {
      fontSize: 11,
      fill: theme === "dark" ? "#ffffff" : "#333333",
    },
    axis: {
      domain: {
        line: {
          stroke: theme === "dark" ? "#777777" : "#cccccc",
          strokeWidth: 1,
        },
      },
      legend: {
        text: {
          fontSize: 12,
          fill: theme === "dark" ? "#ffffff" : "#333333",
        },
      },
      ticks: {
        line: {
          stroke: theme === "dark" ? "#777777" : "#cccccc",
          strokeWidth: 1,
        },
        text: {
          fontSize: 11,
          fill: theme === "dark" ? "#ffffff" : "#333333",
        },
      },
    },
    grid: {
      line: {
        stroke: theme === "dark" ? "#444444" : "#dddddd",
        strokeWidth: 1,
      },
    },
  };

  // Ensure data is always mutable and properly structured
  const mutableData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    // Deep clone the data to ensure it's completely mutable
    return data.map((item) => {
      if (typeof item === "object" && item !== null) {
        const clonedItem = { ...item };

        // If it's line or scatter data, also clone the nested data array
        if ("data" in clonedItem && Array.isArray(clonedItem.data)) {
          clonedItem.data = clonedItem.data.map((point) => ({ ...point }));
        }

        return clonedItem;
      }
      return item;
    });
  }, [data]);

  const renderChart = () => {
    if (!mutableData.length) {
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
      case "line":
        if (!isLineData(mutableData)) {
          console.error(
            "Line chart expects data with structure: { id: string, data: { x: any, y: any }[] }[]"
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
              Invalid line chart data
            </Box>
          );
        }

        // Define properly typed props for ResponsiveLine with required data
        const lineProps: Partial<LineChartProps> & { data: LineChartData[] } = {
          data: mutableData,
          theme: commonTheme,
          margin: { top: 50, right: 110, bottom: 50, left: 60 },
          xScale: { type: "point" },
          yScale: {
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: false,
            reverse: false,
          },
          yFormat: " >-.2f",
          curve: "cardinal",
          axisTop: null,
          axisRight: null,
          axisBottom: {
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
          },
          axisLeft: {
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
          },
          pointSize: 10,
          pointColor: { theme: "background" },
          pointBorderWidth: 2,
          pointBorderColor: { from: "serieColor" },
          pointLabelYOffset: -12,
          useMesh: true,
          animate: interactive,
          motionConfig: "gentle",
          legends: [
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
            },
          ],
        };

        return <ResponsiveLine {...lineProps} />;

      case "bar":
        if (!isBarData(mutableData)) {
          console.error(
            "Bar chart expects data with structure: { [key: string]: string | number }[]"
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
              Invalid bar chart data
            </Box>
          );
        }

        const barData = mutableData as BarChartData[];

        // Find numeric keys for the bar values
        const allKeys = barData.length > 0 ? Object.keys(barData[0]) : [];
        const numericKeys = allKeys.filter((key) =>
          barData.every((item) => typeof item[key] === "number")
        );

        // Find a string key for indexBy (prefer common names)
        const indexKey =
          allKeys.find(
            (key) =>
              barData.every((item) => typeof item[key] === "string") ||
              ["id", "name", "label", "category"].includes(key)
          ) ||
          allKeys[0] ||
          "id";

        if (numericKeys.length === 0) {
          console.error(
            "Bar chart data must have at least one numeric property for values"
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
              No numeric data found for bar chart
            </Box>
          );
        }

        // Define properly typed props for ResponsiveBar with required data and keys
        const barProps: Partial<BarChartProps> & {
          data: BarChartData[];
          keys: string[];
          indexBy: string;
        } = {
          data: barData,
          keys: numericKeys,
          indexBy: indexKey,
          theme: commonTheme,
          margin: { top: 50, right: 130, bottom: 50, left: 60 },
          padding: 0.3,
          valueScale: { type: "linear" },
          indexScale: { type: "band", round: true },
          colors: { scheme: "nivo" },
          borderColor: {
            from: "color",
            modifiers: [["darker", 1.6]],
          },
          axisTop: null,
          axisRight: null,
          axisBottom: {
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
          },
          axisLeft: {
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
          },
          labelSkipWidth: 12,
          labelSkipHeight: 12,
          animate: interactive,
          motionConfig: "gentle",
        };

        return <ResponsiveBar {...barProps} />;

      case "pie":
        if (!isPieData(mutableData)) {
          console.error(
            "Pie chart expects data with structure: { id: string, value: number }[]"
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
              Invalid pie chart data
            </Box>
          );
        }

        // Define properly typed props for ResponsivePie with required data
        const pieProps: Partial<PieChartProps> & { data: PieChartData[] } = {
          data: mutableData,
          theme: commonTheme,
          margin: { top: 40, right: 80, bottom: 80, left: 80 },
          innerRadius: 0.5,
          padAngle: 0.7,
          cornerRadius: 3,
          activeOuterRadiusOffset: 8,
          borderWidth: 1,
          borderColor: {
            from: "color",
            modifiers: [["darker", 0.2]],
          },
          arcLinkLabelsSkipAngle: 10,
          arcLinkLabelsTextColor: theme === "dark" ? "#ffffff" : "#333333",
          arcLinkLabelsThickness: 2,
          arcLinkLabelsColor: { from: "color" },
          arcLabelsSkipAngle: 10,
          arcLabelsTextColor: {
            from: "color",
            modifiers: [["darker", 2]],
          },
          animate: interactive,
          motionConfig: "gentle",
        };

        return <ResponsivePie {...pieProps} />;

      case "scatter":
        if (!isScatterData(mutableData)) {
          console.error(
            "Scatter plot expects data with structure: { id: string, data: { x: number, y: number }[] }[]"
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
              Invalid scatter plot data
            </Box>
          );
        }

        // Define properly typed props for ResponsiveScatterPlot with required data
        const scatterProps: Partial<ScatterChartProps> & {
          data: ScatterPlotData[];
        } = {
          data: mutableData,
          theme: commonTheme,
          margin: { top: 60, right: 140, bottom: 70, left: 90 },
          xScale: { type: "linear", min: 0, max: "auto" },
          yScale: { type: "linear", min: 0, max: "auto" },
          blendMode: "multiply",
          axisTop: null,
          axisRight: null,
          axisBottom: {
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
          },
          axisLeft: {
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
          },
          animate: interactive,
          motionConfig: "gentle",
        };

        return <ResponsiveScatterPlot {...scatterProps} />;

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
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "100%",
        borderRadius: "8px",
        overflow: "hidden",
        position: "relative", // Helps with Nivo positioning
      }}
    >
      {renderChart()} {/* Nivo Responsive components handle their own sizing */}
    </Box>
  );
};
