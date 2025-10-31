import React from "react";
import { Box } from "@mui/material";
import styles from "./CustomContent.module.css";
import { CSSProperties } from "@mui/material/styles";

// CustomContent can wrap any component
export interface CustomContentProps {
  children: React.ReactNode;
  style?: CSSProperties; //optionally provide additional CSS rules
}

export const CustomContent: React.FC<CustomContentProps> = ({ children }) => {
  return (
    <Box className={styles.customContentSection}>
      {children}
    </Box>
  );
};