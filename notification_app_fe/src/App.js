import { BrowserRouter, Routes, Route, Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import AllNotifications from "./pages/AllNotifications";
import PriorityNotifications from "./pages/PriorityNotifications";

const theme = createTheme({
  palette: {
    primary: { main: "#0b7a6e" },
    secondary: { main: "#1a5fb4" },
    background: { default: "#f4f7f6" },
  },
  typography: {
    fontFamily: '"DM Sans", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function NavButtons() {
  const { pathname } = useLocation();
  const activeStyle = { color: "#fff", fontWeight: 700 };
  const idleStyle = { color: "rgba(255,255,255,0.8)", fontWeight: 500 };

  return (
    <>
      <Button
        component={RouterLink}
        to="/"
        color="inherit"
        startIcon={<NotificationsIcon />}
        sx={pathname === "/" ? activeStyle : idleStyle}
      >
        All
      </Button>
      <Button
        component={RouterLink}
        to="/priority"
        color="inherit"
        startIcon={<StarIcon />}
        sx={pathname === "/priority" ? activeStyle : idleStyle}
      >
        Priority
      </Button>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppBar position="sticky" elevation={1}>
          <Toolbar sx={{ gap: 2, flexWrap: "wrap" }}>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
              Campus Notifications
            </Typography>
            <NavButtons />
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ py: 3 }}>
          <Routes>
            <Route path="/" element={<AllNotifications />} />
            <Route path="/priority" element={<PriorityNotifications />} />
          </Routes>
        </Container>

        <Box component="footer" sx={{ textAlign: "center", py: 2, color: "text.secondary" }}>
          <Typography variant="caption">Stage 2 · React + Material UI</Typography>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
