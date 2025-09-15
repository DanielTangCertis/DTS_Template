import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';

interface ChartProps {
  data: any;
  width?: number;
  height?: number;
  top?: number;
  type?: 'line' | 'bar' | 'pie' | 'scatter';
  theme?: 'light' | 'dark';
  interactive?: boolean;
}

const Chart: React.FC<ChartProps> = ({
  data,
  width = 400,
  height = 200,
  top = 0,
  type = 'line',
  theme = 'dark',
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width, height });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: rect.width || width,
          height: rect.height || height,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [width, height]);

  const commonTheme = {
    background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    text: {
      fontSize: 11,
      fill: theme === 'dark' ? '#ffffff' : '#333333',
    },
    axis: {
      domain: {
        line: {
          stroke: theme === 'dark' ? '#777777' : '#cccccc',
          strokeWidth: 1,
        },
      },
      legend: {
        text: {
          fontSize: 12,
          fill: theme === 'dark' ? '#ffffff' : '#333333',
        },
      },
      ticks: {
        line: {
          stroke: theme === 'dark' ? '#777777' : '#cccccc',
          strokeWidth: 1,
        },
        text: {
          fontSize: 11,
          fill: theme === 'dark' ? '#ffffff' : '#333333',
        },
      },
    },
    grid: {
      line: {
        stroke: theme === 'dark' ? '#444444' : '#dddddd',
        strokeWidth: 1,
      },
    },
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveLine
            data={data}
            theme={commonTheme}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: true,
              reverse: false,
            }}
            yFormat=" >-.2f"
            curve="cardinal"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            animate={interactive}
            motionConfig="gentle"
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
              },
            ]}
          />
        );

      case 'bar':
        return (
          <ResponsiveBar
            data={data}
            theme={commonTheme}
            keys={Object.keys(data[0] || {}).filter(key => key !== 'id')}
            indexBy="id"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'nivo' }}
            borderColor={{
              from: 'color',
              modifiers: [['darker', 1.6]],
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            animate={interactive}
            motionConfig="gentle"
          />
        );

      case 'pie':
        return (
          <ResponsivePie
            data={data}
            theme={commonTheme}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
              from: 'color',
              modifiers: [['darker', 0.2]],
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor={theme === 'dark' ? '#ffffff' : '#333333'}
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
              from: 'color',
              modifiers: [['darker', 2]],
            }}
            animate={interactive}
            motionConfig="gentle"
          />
        );

      case 'scatter':
        return (
          <ResponsiveScatterPlot
            data={data}
            theme={commonTheme}
            margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
            xScale={{ type: 'linear', min: 0, max: 'auto' }}
            yScale={{ type: 'linear', min: 0, max: 'auto' }}
            blendMode="multiply"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }}
            animate={interactive}
            motionConfig="gentle"
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        width: width || '100%',
        height: height,
        marginTop: `${top}px`,
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {renderChart()}
    </Box>
  );
};

export default Chart;