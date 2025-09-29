import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { HeaderProvider } from "./contexts/HeaderContext";
import { DigitalTwinProvider } from "./contexts/DigitalTwinContext";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import DigitalTwinLoadingManager from "./components/DigitalTwinLoadingManager/DigitalTwinLoadingManager";

// Pages
import HomePage from "./pages/HomePage";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import Page3 from "./pages/Page3";
import NotFound from "./pages/NotFound";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7afafe",
    },
    secondary: {
      main: "#ffffff",
    },
    background: {
      default: "#000000",
      paper: "rgba(0, 0, 0, 0.8)",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
  typography: {
    fontFamily: "Oppo, Arial, sans-serif",
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <DigitalTwinProvider>
        <HeaderProvider>
          <Router>
            <ErrorBoundary componentName="App" showRetry={false}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/page1" element={<Page1 />} />
                <Route path="/page2" element={<Page2 />} />
                <Route path="/page3" element={<Page3 />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              <DigitalTwinLoadingManager />
            </ErrorBoundary>
          </Router>
        </HeaderProvider>
      </DigitalTwinProvider>
    </ThemeProvider>
  );
};

export default App;