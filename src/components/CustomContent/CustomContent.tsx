import React from "react";
import { Box } from "@mui/material";
import styles from "./CustomContent.module.css";

// CustomContent can wrap any component
export interface CustomContentProps {
  children: React.ReactNode;
}

export const CustomContent: React.FC<CustomContentProps> = ({ children }) => {
  return (
    <Box className={styles.customContentSection}>
      {children}
    </Box>
  );
};