import { useEffect, useState } from "react";
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
import { fetchAllNotifications } from "../api";
import NotificationCard from "../components/NotificationCard";
import { getTopPriority } from "../utils/priority";
import { useReadState } from "../hooks/useReadState";

const TOP_N = 10;

const PriorityNotifications = () => {
  const [data, setData] = useState([]);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isRead, markRead, markUnread } = useReadState();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const all = await fetchAllNotifications(type);
        const top = getTopPriority(all, TOP_N);
        if (!cancelled) setData(top);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message);
          setData([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [type]);

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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
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
