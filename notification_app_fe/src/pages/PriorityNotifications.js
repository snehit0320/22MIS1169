import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { fetchPriorityInbox } from "../api";
import NotificationCard from "../components/NotificationCard";
import { useReadState } from "../hooks/useReadState";
import TokenBanner from "../components/TokenBanner";

const TOP_N = 10;

const isTokenError = (message) => {
  const lower = (message || "").toLowerCase();
  return lower.includes("token") || lower.includes("authorization");
};

const PriorityNotifications = () => {
  const [data, setData] = useState([]);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isRead, markRead, markUnread } = useReadState();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const top = await fetchPriorityInbox(type, TOP_N);
      setData(top);
    } catch (err) {
      setError(err.message || "Failed to load priority notifications");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleRead = (id) => {
    if (isRead(id)) markUnread(id);
    else markRead(id);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Top Priority Notifications
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Top {TOP_N} by weight: Placement → Result → Event, then newest first.
      </Typography>

      <FormControl size="small" sx={{ minWidth: 160, mb: 2 }}>
        <InputLabel id="priority-type-label">Filter type</InputLabel>
        <Select
          labelId="priority-type-label"
          value={type}
          label="Filter type"
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="">All types</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
        </Select>
      </FormControl>

      <TokenBanner error={error} onSaved={load} />

      {error && !isTokenError(error) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          {(error.includes("Network") || error.includes("ECONNREFUSED")) && (
            <>
              {" "}
              — Start backend: <code>cd notification_app_be</code> then{" "}
              <code>npm start</code>
            </>
          )}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : !error && data.length === 0 ? (
        <Alert severity="info">No notifications to rank.</Alert>
      ) : (
        data.map((n, index) => (
          <NotificationCard
            key={n.ID}
            data={n}
            rank={index + 1}
            isRead={isRead(n.ID)}
            onToggleRead={toggleRead}
          />
        ))
      )}
    </Box>
  );
};

export default PriorityNotifications;
