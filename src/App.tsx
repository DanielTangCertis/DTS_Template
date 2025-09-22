import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { DigitalTwinProvider } from "./contexts/DigitalTwinContext";
import { HeaderProvider } from "./contexts/HeaderContext";
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
            <Routes>
              {/* Redirect root to /home */}
              <Route path="/" element={<Navigate to="/home" replace />} />

              {/* Home route with nested child routes */}
              <Route path="/home" element={<HomePage />}>
                <Route path="page1" element={<Page1 />} />
                <Route path="page2" element={<Page2 />} />
                <Route path="page3" element={<Page3 />} />
              </Route>

              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </HeaderProvider>
      </DigitalTwinProvider>
    </ThemeProvider>
  );
};

export default App;
