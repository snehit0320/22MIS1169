import { useCallback, useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { fetchNotifications } from "../api";
import NotificationCard from "../components/NotificationCard";
import FilterBar from "../components/FilterBar";
import PaginationBar from "../components/PaginationBar";
import { useReadState } from "../hooks/useReadState";

const AllNotifications = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasNext, setHasNext] = useState(false);
  const { isRead, markRead, markUnread } = useReadState();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { notifications } = await fetchNotifications(page, limit, type);
      setData(notifications);
      setHasNext(notifications.length === limit);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setData([]);
      setHasNext(false);
    } finally {
      setLoading(false);
    }
  }, [page, limit, type]);

  useEffect(() => {
    load();
  }, [load]);

  const handleTypeChange = (value) => {
    setType(value);
    setPage(1);
  };

  const handleLimitChange = (value) => {
    setLimit(value);
    setPage(1);
  };

  const toggleRead = (id) => {
    if (isRead(id)) markUnread(id);
    else markRead(id);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        All Notifications
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Filter by type, paginate results, and mark items read or unread.
      </Typography>

      <FilterBar
        type={type}
        onTypeChange={handleTypeChange}
        limit={limit}
        onLimitChange={handleLimitChange}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : data.length === 0 ? (
        <Alert severity="info">No notifications found.</Alert>
      ) : (
        data.map((n) => (
          <NotificationCard
            key={n.ID}
            data={n}
            isRead={isRead(n.ID)}
            onToggleRead={toggleRead}
          />
        ))
      )}

      <PaginationBar
        page={page}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
        hasNext={hasNext}
        disabled={loading}
      />
    </Box>
  );
};

export default AllNotifications;
