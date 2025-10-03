// Sample data generators for MUI Charts

// Sparkline Chart Sample Data
export const sparklineSampleData = () => ({
  data: [12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45, 48],
  xAxis: {
    scaleType: "linear" as const,
  },
});

export const sparklineSampleData2 = () => ({
  data: [100, 95, 110, 105, 120, 115, 130, 125, 140, 135, 150, 145, 160],
  xAxis: {
    data: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    scaleType: "band" as const,
  },
});

// Radar Chart Sample Data
export const radarSampleData = () => ({
  series: [
    {
      data: [80, 70, 90, 85, 75, 60],
      label: "Current Year",
      color: "#7afafe",
    },
    {
      data: [65, 85, 75, 90, 80, 70],
      label: "Previous Year",
      color: "#93c0ec",
    },
  ],
  radar: {
    max: 100,
    metrics: ["Security", "Maintenance", "Energy", "Safety", "Efficiency", "Cost"],
  },
  divisions: 4,
  margin: { top: 50, right: 80, bottom: 80, left: 80 },
});

export const radarSampleData2 = () => ({
  series: [
    {
      data: [85, 90, 75, 95, 80],
      label: "System Metrics",
      color: "#00ffff",
    },
  ],
  radar: {
    max: 100,
    metrics: ["Performance", "Reliability", "Scalability", "Security", "Usability"],
  },
  divisions: 5,
  margin: { top: 40, right: 60, bottom: 60, left: 60 },
});

// Temperature Sparkline (for monitoring)
export const temperatureSampleData = () => ({
  data: [22, 22.5, 23, 22.8, 23.2, 23.5, 24, 24.2, 24.5, 24.8, 25, 25.2],
  xAxis: {
    data: Array.from({ length: 12 }, (_, i) => `${i}:00`),
    scaleType: "band" as const,
  },
});

// Traffic Flow Sparkline
export const trafficFlowSampleData = () => ({
  data: [120, 135, 150, 160, 175, 165, 155, 140, 125, 110, 95, 85],
  xAxis: {
    scaleType: "linear" as const,
  },
});

// Comprehensive Radar for Facility Management
export const facilityRadarData = () => ({
  series: [
    {
      data: [88, 92, 95, 78, 85, 90, 98, 87],
      label: "Current",
      color: "#7afafe",
    },
    {
      data: [90, 85, 95, 80, 75, 88, 95, 90],
      label: "Target",
      color: "#93c0ec",
    },
  ],
  radar: {
    max: 100,
    metrics: [
      "HVAC",
      "Lighting",
      "Security",
      "Cleaning",
      "Landscaping",
      "IT Systems",
      "Fire Safety",
      "Elevators",
    ],
  },
  divisions: 5,
  margin: { top: 60, right: 100, bottom: 80, left: 100 },
});

// Advanced Radar with custom metric min/max values
export const advancedRadarData = () => ({
  series: [
    {
      data: [42, 28, 95, 150, 3.2, 88],
      label: "Performance Metrics",
      color: "#7afafe",
    },
  ],
  radar: {
    metrics: [
      { name: "Response Time", max: 50, min: 0 }, // milliseconds
      { name: "Error Rate", max: 100, min: 0 }, // percentage
      { name: "Uptime", max: 100, min: 0 }, // percentage
      { name: "Throughput", max: 200, min: 0 }, // requests/sec
      { name: "Latency", max: 5, min: 0 }, // seconds
      { name: "CPU Usage", max: 100, min: 0 }, // percentage
    ],
  },
  divisions: 4,
  margin: { top: 50, right: 120, bottom: 80, left: 120 },
});