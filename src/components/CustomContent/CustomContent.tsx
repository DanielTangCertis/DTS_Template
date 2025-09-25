import React from "react";
import { Box, Typography, Grid, List, ListItem } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import { IconBox, Title } from "../Layout";
import styles from "./CustomContent.module.css";

// Define data interfaces
export interface TrafficDataItem {
  icon: string;
  label: string;
  value: string;
  suffix?: string;
}

export interface PersonnelDataItem {
  info: string;
  count: number;
  unit: string;
}

// Component props interfaces
interface TrafficProps {
  title: string;
  data: TrafficDataItem[];
}

interface PersonnelProps {
  title: string;
  data: PersonnelDataItem[];
}

// Traffic component
export const Traffic: React.FC<TrafficProps> = ({ title, data }) => (
  <Box className={styles.customContentSection}>
    <Title>{title}</Title>
    <Grid container spacing={2} className={styles.trafficGrid}>
      {data.map((item, index) => (
        <Grid size={6} key={index}>
          <Box className={styles.trafficItem}>
            <IconBox width={30} height={30}>
              <img src={item.icon} alt={item.label} />
            </IconBox>
            <Box className={styles.trafficContent}>
              <Typography className={styles.trafficLabel}>
                {item.label}
              </Typography>
              <Box className={styles.trafficValue}>
                {item.value}
                {item.suffix && (
                  <Box className={styles.trafficSuffix}>
                    {item.suffix}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
);

// Personnel component
export const Personnel: React.FC<PersonnelProps> = ({ title, data }) => (
  <Box className={styles.customContentSection}>
    <Title>{title}</Title>
    <Box className={styles.personnelContainer}>
      <List className={styles.personnelList}>
        {data.map((item, index) => (
          <ListItem key={index} className={styles.personnelItem}>
            <Box className={styles.personnelInfo}>
              <PersonIcon className={styles.personnelIcon} />
              <Typography className={styles.personnelLabel}>
                {item.info}
              </Typography>
            </Box>
            <Typography className={styles.personnelValue}>
              {item.count}
              <Typography
                component="span"
                className={styles.personnelUnit}
              >
                {item.unit}
              </Typography>
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  </Box>
);

// Generic custom content renderer
export interface CustomContentConfig {
  id: string;
  type: "traffic" | "personnel";
  title: string;
  data: TrafficDataItem[] | PersonnelDataItem[];
}

interface CustomContentProps {
  config: CustomContentConfig;
}

export const CustomContent: React.FC<CustomContentProps> = ({ config }) => {
  switch (config.type) {
    case "traffic":
      return (
        <Traffic
          title={config.title}
          data={config.data as TrafficDataItem[]}
        />
      );
    case "personnel":
      return (
        <Personnel
          title={config.title}
          data={config.data as PersonnelDataItem[]}
        />
      );
    default:
      return null;
  }
};