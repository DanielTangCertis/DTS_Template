import { Box, Typography, Grid, List, ListItem } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import {
  pieSampleData,
  barSampleData,
  lineSampleData,
  barSampleData2,
  expenditureData,
  personnelData,
} from "@/data/sampleData";
import { Panel } from "../components/Panel/Panel";
import { NivoChart } from "../components/NivoChart/NivoChart";
import { CustomContent } from "../components/CustomContent/CustomContent";
import { IconBox, Title } from "../components/Layout";

import styles from "../components/CustomContent/CustomContent.module.css";

const Page1: React.FC = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Left Panel */}
      <Panel side="left" delay={0}>
        {/* Expenditure Custom Content */}
        <CustomContent>
          <Title>Expenditure</Title>
          <Grid container spacing={2} className={styles.expenditureGrid}>
            {expenditureData().map((item, index) => (
              <Grid size={6} key={index}>
                <Box className={styles.expenditureItem}>
                  <IconBox width={30} height={30}>
                    <img src={item.icon} alt={item.label} />
                  </IconBox>
                  <Box className={styles.expenditureContent}>
                    <Typography className={styles.expenditureLabel}>
                      {item.label}
                    </Typography>
                    <Box className={styles.expenditureValue}>
                      {item.value}
                      {item.suffix && (
                        <Box className={styles.expenditureSuffix}>
                          {item.suffix}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CustomContent>

        {/* Charts */}
        <NivoChart
          type="pie"
          title="Incidents Reported by Category (YTD)"
          data={pieSampleData()}
        />

        <NivoChart
          type="bar"
          title="Standard deviation of incidents reported by Category"
          data={barSampleData()}
        />
      </Panel>

      {/* Right Panel */}
      <Panel side="right" delay={0}>
        {/* Personnel Custom Content */}
        <CustomContent>
          <Title>Personnel Overview</Title>
          <Box className={styles.personnelContainer}>
            <List className={styles.personnelList}>
              {personnelData().map((item, index) => (
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
        </CustomContent>

        {/* Charts */}
        <NivoChart type="line" title="Crowd Flow" data={lineSampleData()} />
        <NivoChart type="bar" title="Add Label Here" data={barSampleData2()} />
      </Panel>
    </Box>
  );
};

export default Page1;
