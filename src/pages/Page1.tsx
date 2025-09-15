import React from "react";
import { Box, styled } from "@mui/material";
import { LayoutBox } from "../components/Layout";
import {LeftPanel} from "../components/Page1/LeftPanel";
import {RightPanel} from "../components/Page1/RightPanel";

const Page1Container = styled(Box)({
  width: "100%",
  height: "100%",
  position: "relative",
  overflow: "hidden",
});

const Page1: React.FC = () => {
  return (
    <Page1Container>
      <LayoutBox side="left" delay={300}>
        <LeftPanel />
      </LayoutBox>
      <LayoutBox side="right" delay={300}>
        <RightPanel />
      </LayoutBox>
    </Page1Container>
  );
};

export default Page1;