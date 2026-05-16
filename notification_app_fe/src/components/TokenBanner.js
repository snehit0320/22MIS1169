import { useState } from "react";
import { Alert, Box, Button, TextField } from "@mui/material";
import { getAuthToken, setAuthToken } from "../api";

const TokenBanner = ({ error, onSaved }) => {
  const [token, setToken] = useState(getAuthToken());
  const show =
    error &&
    (error.toLowerCase().includes("token") ||
      error.toLowerCase().includes("authorization") ||
      error.includes("401"));

  if (!show) return null;

  return (
    <Alert severity="warning" sx={{ mb: 2 }}>
      <Box sx={{ mb: 1 }}>
        {error}. Paste a fresh evaluation token below, then click Save & reload.
      </Box>
      <TextField
        fullWidth
        size="small"
        label="Bearer token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        sx={{ mb: 1, bgcolor: "background.paper" }}
      />
      <Button
        variant="contained"
        size="small"
        onClick={() => {
          setAuthToken(token);
          onSaved();
        }}
      >
        Save & reload
      </Button>
    </Alert>
  );
};

export default TokenBanner;
